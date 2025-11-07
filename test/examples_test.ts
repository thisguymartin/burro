import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { HeuristicEval, HeuristicEvalItem } from "../src/services/heuristics.ts";
import {
  FactualityEval,
  FactualityEvalItem,
} from "../src/services/faculty.ts";
import { CloseCaseQA, QAEvalItem } from "../src/services/close-qa.ts";

async function loadJsonFile<T>(path: string): Promise<T> {
  const content = await Deno.readTextFile(path);
  return JSON.parse(content);
}

Deno.test("Example Files - Validation", async (t) => {
  await t.step("levenshtein.json should be valid", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/levenshtein.json",
    );
    assertExists(items);
    assertEquals(Array.isArray(items), true);
    assertEquals(items.length > 0, true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.expected);
    }
  });

  await t.step("exact-match.json should be valid", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/exact-match.json",
    );
    assertExists(items);
    assertEquals(Array.isArray(items), true);
    assertEquals(items.length > 0, true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.expected);
    }
  });

  await t.step("numeric.json should be valid", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/numeric.json",
    );
    assertExists(items);
    assertEquals(Array.isArray(items), true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.expected);
      assertExists(item.tolerance);
    }
  });

  await t.step("json-diff.json should be valid", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/json-diff.json",
    );
    assertExists(items);
    assertEquals(Array.isArray(items), true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.expected);
      // Verify output and expected are valid JSON
      JSON.parse(item.output);
      JSON.parse(item.expected);
    }
  });

  await t.step("jaccard.json should be valid", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/jaccard.json",
    );
    assertExists(items);
    assertEquals(Array.isArray(items), true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.expected);
    }
  });

  await t.step("evals.json should be valid", async () => {
    const items = await loadJsonFile<FactualityEvalItem[]>(
      "example/evals.json",
    );
    assertExists(items);
    assertEquals(Array.isArray(items), true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.expected);
    }
  });

  await t.step("closeqa.json should be valid", async () => {
    const items = await loadJsonFile<QAEvalItem[]>("example/closeqa.json");
    assertExists(items);
    assertEquals(Array.isArray(items), true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.criteria);
    }
  });

  await t.step("battle.json should be valid", async () => {
    const items = await loadJsonFile<any[]>("example/battle.json");
    assertExists(items);
    assertEquals(Array.isArray(items), true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.expected);
    }
  });

  await t.step("summarization.json should be valid", async () => {
    const items = await loadJsonFile<any[]>("example/summarization.json");
    assertExists(items);
    assertEquals(Array.isArray(items), true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.context);
    }
  });

  await t.step("sql.json should be valid", async () => {
    const items = await loadJsonFile<any[]>("example/sql.json");
    assertExists(items);
    assertEquals(Array.isArray(items), true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.expected);
    }
  });

  await t.step("translation.json should be valid", async () => {
    const items = await loadJsonFile<any[]>("example/translation.json");
    assertExists(items);
    assertEquals(Array.isArray(items), true);

    for (const item of items) {
      assertExists(item.input);
      assertExists(item.output);
      assertExists(item.expected);
    }
  });
});

Deno.test("Example Files - Execute Evaluations", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should execute levenshtein evaluation", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/levenshtein.json",
    );
    const results = await heuristic.evaluateItems(items, "levenshtein");
    assertEquals(results.length, items.length);

    for (const result of results) {
      assertExists(result.name);
      assertExists(result.score);
      assertExists(result.metadata);
      assertEquals(result.score >= 0 && result.score <= 1, true);
    }
  });

  await t.step("should execute exact match evaluation", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/exact-match.json",
    );
    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results.length, items.length);

    // All examples should match exactly
    for (const result of results) {
      assertEquals(result.score, 1);
      assertEquals(result.metadata.matched, true);
    }
  });

  await t.step("should execute numeric evaluation", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/numeric.json",
    );
    const results = await heuristic.evaluateItems(items, "numeric");
    assertEquals(results.length, items.length);

    for (const result of results) {
      assertExists(result.score);
      assertEquals(result.score >= 0 && result.score <= 1, true);
    }
  });

  await t.step("should execute JSON diff evaluation", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/json-diff.json",
    );
    const results = await heuristic.evaluateItems(items, "json");
    assertEquals(results.length, items.length);

    for (const result of results) {
      assertExists(result.score);
      assertExists(result.metadata.evaluationType);
      assertEquals(result.metadata.evaluationType, "json_diff");
    }
  });

  await t.step("should execute Jaccard evaluation", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/jaccard.json",
    );
    const results = await heuristic.evaluateItems(items, "jaccard");
    assertEquals(results.length, items.length);

    for (const result of results) {
      assertExists(result.score);
      assertEquals(result.score >= 0 && result.score <= 1, true);
    }
  });

  await t.step("should execute contains evaluation", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/levenshtein.json",
    );
    const results = await heuristic.evaluateItems(items, "contains");
    assertEquals(results.length, items.length);
  });

  await t.step("should execute case insensitive evaluation", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/exact-match.json",
    );
    const results = await heuristic.evaluateItems(items, "case_insensitive");
    assertEquals(results.length, items.length);
  });
});

Deno.test("Example Files - Content Validation", async (t) => {
  await t.step("levenshtein.json should have typo examples", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/levenshtein.json",
    );

    // Should have at least one example with a typo (Shakespear vs Shakespeare)
    const hasTypo = items.some(
      (item) =>
        item.output.includes("Shakespear") &&
        item.expected.includes("Shakespeare"),
    );
    assertEquals(hasTypo, true);
  });

  await t.step("exact-match.json should have perfect matches", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/exact-match.json",
    );

    // All outputs should exactly match expected
    for (const item of items) {
      assertEquals(item.output, item.expected);
    }
  });

  await t.step("numeric.json should have tolerance values", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/numeric.json",
    );

    // All items should have tolerance
    for (const item of items) {
      assertExists(item.tolerance);
      assertEquals(typeof item.tolerance, "number");
      assertEquals(item.tolerance > 0, true);
    }
  });

  await t.step("json-diff.json should have valid JSON strings", async () => {
    const items = await loadJsonFile<HeuristicEvalItem[]>(
      "example/json-diff.json",
    );

    for (const item of items) {
      // Should not throw when parsing
      const outputObj = JSON.parse(item.output);
      const expectedObj = JSON.parse(item.expected);

      assertExists(outputObj);
      assertExists(expectedObj);
    }
  });

  await t.step("closeqa.json should have criteria", async () => {
    const items = await loadJsonFile<QAEvalItem[]>("example/closeqa.json");

    for (const item of items) {
      assertExists(item.criteria);
      assertEquals(typeof item.criteria, "string");
      assertEquals(item.criteria.length > 0, true);
    }
  });
});

Deno.test("Example Files - Real-World Scenarios", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate order ID extraction", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Extract the order ID: Your order #ORD-12345 has been shipped",
        output: "ORD-12345",
        expected: "ORD-12345",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results[0].score, 1);
    assertEquals(results[0].metadata.matched, true);
  });

  await t.step("should validate price extraction with tolerance", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "What's the price? The item costs $49.99",
        output: "49.99",
        expected: "49.99",
        tolerance: 0.01,
      },
    ];

    const results = await heuristic.evaluateItems(items, "numeric");
    assertEquals(results[0].score, 1);
    assertEquals(results[0].metadata.matched, true);
  });

  await t.step("should validate JSON data extraction", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Extract: John Doe, johndoe@email.com, 555-1234",
        output: '{"name": "John Doe", "email": "johndoe@email.com", "phone": "555-1234"}',
        expected: '{"name": "John Doe", "email": "johndoe@email.com", "phone": "555-1234"}',
      },
    ];

    const results = await heuristic.evaluateItems(items, "json");
    assertEquals(results[0].score, 1);
    assertEquals(results[0].metadata.matched, true);
  });

  await t.step("should validate keyword matching", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "List programming languages",
        output: "JavaScript Python Ruby Java",
        expected: "JavaScript Python Ruby PHP",
      },
    ];

    const results = await heuristic.evaluateItems(items, "jaccard");
    // Should have high similarity (3 out of 5 words match)
    assertEquals(results[0].score > 0.5, true);
  });

  await t.step("should validate contains for key phrases", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "What is the capital of France?",
        output: "The capital city of France is Paris",
        expected: "Paris",
      },
    ];

    const results = await heuristic.evaluateItems(items, "contains");
    assertEquals(results[0].score, 1);
    assertEquals(results[0].metadata.matched, true);
  });
});
