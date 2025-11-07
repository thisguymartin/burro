import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { HeuristicEval, HeuristicEvalItem } from "../src/services/heuristics.ts";

Deno.test("HeuristicEval - Levenshtein Distance", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should calculate perfect match", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "hello",
      expected: "hello",
    };
    const result = evaluator.evaluateLevenshtein(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should calculate similarity for close matches", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "William Shakespear",
      expected: "William Shakespeare",
    };
    const result = evaluator.evaluateLevenshtein(item);
    // Score should be high but not perfect (1 character difference)
    assertEquals(result.score > 0.9, true);
    assertEquals(result.score < 1, true);
  });

  await t.step("should calculate low score for very different strings", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "abc",
      expected: "xyz",
    };
    const result = evaluator.evaluateLevenshtein(item);
    assertEquals(result.score, 0);
    assertEquals(result.metadata.matched, false);
  });
});

Deno.test("HeuristicEval - Exact Match", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should match identical strings", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "US",
      expected: "US",
    };
    const result = evaluator.evaluateExactMatch(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should not match different strings", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "US",
      expected: "USA",
    };
    const result = evaluator.evaluateExactMatch(item);
    assertEquals(result.score, 0);
    assertEquals(result.metadata.matched, false);
  });

  await t.step("should be case sensitive", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "hello",
      expected: "Hello",
    };
    const result = evaluator.evaluateExactMatch(item);
    assertEquals(result.score, 0);
    assertEquals(result.metadata.matched, false);
  });
});

Deno.test("HeuristicEval - Case Insensitive Match", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should match regardless of case", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "HELLO",
      expected: "hello",
    };
    const result = evaluator.evaluateCaseInsensitiveMatch(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should match mixed case", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "HeLLo WoRLD",
      expected: "hello world",
    };
    const result = evaluator.evaluateCaseInsensitiveMatch(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should not match different content", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "hello",
      expected: "goodbye",
    };
    const result = evaluator.evaluateCaseInsensitiveMatch(item);
    assertEquals(result.score, 0);
    assertEquals(result.metadata.matched, false);
  });
});

Deno.test("HeuristicEval - Numeric Difference", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should match exact numbers", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "3.14",
      expected: "3.14",
      tolerance: 0.01,
    };
    const result = evaluator.evaluateNumericDifference(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should match within tolerance", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "3.14",
      expected: "3.14159",
      tolerance: 0.01,
    };
    const result = evaluator.evaluateNumericDifference(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should not match outside tolerance", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "3.14",
      expected: "3.5",
      tolerance: 0.01,
    };
    const result = evaluator.evaluateNumericDifference(item);
    assertEquals(result.metadata.matched, false);
  });

  await t.step("should handle invalid numbers", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "not a number",
      expected: "3.14",
    };
    const result = evaluator.evaluateNumericDifference(item);
    assertEquals(result.score, 0);
    assertEquals(result.metadata.matched, false);
  });

  await t.step("should use default tolerance", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "100.005",
      expected: "100.0",
    };
    const result = evaluator.evaluateNumericDifference(item);
    assertEquals(result.metadata.matched, true);
  });
});

Deno.test("HeuristicEval - JSON Diff", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should match identical JSON objects", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: '{"name": "John", "age": 30}',
      expected: '{"name": "John", "age": 30}',
    };
    const result = evaluator.evaluateJsonDiff(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should match JSON with different key order", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: '{"age": 30, "name": "John"}',
      expected: '{"name": "John", "age": 30}',
    };
    const result = evaluator.evaluateJsonDiff(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should detect missing keys", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: '{"name": "John"}',
      expected: '{"name": "John", "age": 30}',
    };
    const result = evaluator.evaluateJsonDiff(item);
    assertEquals(result.metadata.matched, false);
    assertEquals(result.metadata.details.includes("age"), true);
  });

  await t.step("should detect extra keys", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: '{"name": "John", "age": 30, "city": "NYC"}',
      expected: '{"name": "John", "age": 30}',
    };
    const result = evaluator.evaluateJsonDiff(item);
    assertEquals(result.metadata.matched, false);
  });

  await t.step("should detect value differences", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: '{"name": "John", "age": 25}',
      expected: '{"name": "John", "age": 30}',
    };
    const result = evaluator.evaluateJsonDiff(item);
    assertEquals(result.metadata.matched, false);
  });

  await t.step("should handle invalid JSON", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "not json",
      expected: '{"name": "John"}',
    };
    const result = evaluator.evaluateJsonDiff(item);
    assertEquals(result.score, 0);
    assertEquals(result.metadata.matched, false);
  });
});

Deno.test("HeuristicEval - Jaccard Similarity", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should calculate perfect similarity for identical sets", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "apple banana orange",
      expected: "apple banana orange",
    };
    const result = evaluator.evaluateJaccard(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should calculate similarity for overlapping sets", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "JavaScript TypeScript Python Ruby",
      expected: "JavaScript Python Ruby PHP",
    };
    const result = evaluator.evaluateJaccard(item);
    // 3 in common (JavaScript, Python, Ruby) out of 5 total
    assertEquals(result.score, 3 / 5);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should handle no overlap", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "apple banana",
      expected: "car truck",
    };
    const result = evaluator.evaluateJaccard(item);
    assertEquals(result.score, 0);
    assertEquals(result.metadata.matched, false);
  });

  await t.step("should be case insensitive", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "APPLE BANANA",
      expected: "apple banana",
    };
    const result = evaluator.evaluateJaccard(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });
});

Deno.test("HeuristicEval - Contains", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should match when substring is present", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "The capital of France is Paris",
      expected: "Paris",
    };
    const result = evaluator.evaluateContains(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should be case insensitive", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "The capital is PARIS",
      expected: "paris",
    };
    const result = evaluator.evaluateContains(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should not match when substring is absent", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "The capital of France is Lyon",
      expected: "Paris",
    };
    const result = evaluator.evaluateContains(item);
    assertEquals(result.score, 0);
    assertEquals(result.metadata.matched, false);
  });

  await t.step("should match partial words", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "Parisian culture",
      expected: "Paris",
    };
    const result = evaluator.evaluateContains(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });
});

Deno.test("HeuristicEval - evaluateItems batch processing", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should process multiple items with exact match", async () => {
    const items: HeuristicEvalItem[] = [
      { input: "test1", output: "US", expected: "US" },
      { input: "test2", output: "UK", expected: "UK" },
      { input: "test3", output: "CA", expected: "CA" },
    ];
    const results = await evaluator.evaluateItems(items, "exact");
    assertEquals(results.length, 3);
    assertEquals(results.every((r) => r.score === 1), true);
  });

  await t.step("should process multiple items with levenshtein", async () => {
    const items: HeuristicEvalItem[] = [
      { input: "test1", output: "hello", expected: "hello" },
      { input: "test2", output: "helo", expected: "hello" },
    ];
    const results = await evaluator.evaluateItems(items, "levenshtein");
    assertEquals(results.length, 2);
    assertEquals(results[0].score, 1);
    assertEquals(results[1].score < 1, true);
  });

  await t.step("should throw error for unknown type", async () => {
    const items: HeuristicEvalItem[] = [
      { input: "test", output: "test", expected: "test" },
    ];
    try {
      await evaluator.evaluateItems(items, "unknown" as any);
      throw new Error("Should have thrown");
    } catch (error: unknown) {
      const err = error as Error;
      assertEquals(err.message.includes("Unknown evaluation type"), true);
    }
  });
});

Deno.test("HeuristicEval - Edge Cases", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should handle empty strings in exact match", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "",
      expected: "",
    };
    const result = evaluator.evaluateExactMatch(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should handle empty strings in levenshtein", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "",
      expected: "hello",
    };
    const result = evaluator.evaluateLevenshtein(item);
    assertEquals(result.score, 0);
  });

  await t.step("should handle special characters in JSON", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: '{"message": "Hello\\nWorld"}',
      expected: '{"message": "Hello\\nWorld"}',
    };
    const result = evaluator.evaluateJsonDiff(item);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should handle nested JSON objects", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: '{"user": {"name": "John", "age": 30}}',
      expected: '{"user": {"name": "John", "age": 30}}',
    };
    const result = evaluator.evaluateJsonDiff(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should handle very large numbers", () => {
    const item: HeuristicEvalItem = {
      input: "test",
      output: "299792458",
      expected: "299792458",
      tolerance: 100,
    };
    const result = evaluator.evaluateNumericDifference(item);
    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });
});

Deno.test("HeuristicEval - printResults", () => {
  const results = [
    {
      name: "Test 1",
      score: 1,
      metadata: {
        evaluationType: "exact",
        details: "Perfect match",
        matched: true,
      },
    },
    {
      name: "Test 2",
      score: 0.5,
      metadata: {
        evaluationType: "levenshtein",
        details: "Partial match",
        matched: false,
      },
    },
  ];

  // This should not throw
  HeuristicEval.printResults(results);
});
