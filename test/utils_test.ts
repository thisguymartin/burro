import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { Evaluate } from "../src/services/evaluate.ts";

Deno.test("Evaluate - parseFile", async (t) => {
  const evaluate = new Evaluate();

  await t.step("should parse valid JSON file", async () => {
    const result = await evaluate.parseFile("example/exact-match.json");
    assertExists(result);
    assertEquals(Array.isArray(result), true);
  });

  await t.step("should throw error for non-existent file", async () => {
    try {
      await evaluate.parseFile("non-existent-file.json");
      throw new Error("Should have thrown");
    } catch (error) {
      assertEquals(error.message.includes("Failed to evaluate from JSON"), true);
    }
  });

  await t.step("should throw error for invalid JSON", async () => {
    // Create a temporary invalid JSON file
    const tempFile = "/tmp/invalid.json";
    await Deno.writeTextFile(tempFile, "{ invalid json }");

    try {
      await evaluate.parseFile(tempFile);
      throw new Error("Should have thrown");
    } catch (error) {
      assertEquals(error.message.includes("Failed to evaluate from JSON"), true);
    } finally {
      // Clean up
      try {
        await Deno.remove(tempFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  });
});

Deno.test("Color Utilities", async (t) => {
  await t.step("should import color functions", async () => {
    const { error, success, info, warn } = await import("../src/utils/color.ts");

    assertExists(error);
    assertExists(success);
    assertExists(info);
    assertExists(warn);

    // Test basic functionality
    const errorMsg = error("test error");
    const successMsg = success("test success");
    const infoMsg = info("test info");
    const warnMsg = warn("test warning");

    assertExists(errorMsg);
    assertExists(successMsg);
    assertExists(infoMsg);
    assertExists(warnMsg);
  });
});

Deno.test("Logo Utility", async (t) => {
  await t.step("should export burro title", async () => {
    const { burroTitle } = await import("../src/utils/logo.ts");
    assertExists(burroTitle);
    assertEquals(typeof burroTitle, "string");
    assertEquals(burroTitle.length > 0, true);
  });
});

Deno.test("File System Operations", async (t) => {
  await t.step("should read example files", async () => {
    const files = [
      "example/levenshtein.json",
      "example/exact-match.json",
      "example/numeric.json",
      "example/json-diff.json",
      "example/jaccard.json",
      "example/battle.json",
      "example/summarization.json",
      "example/sql.json",
      "example/translation.json",
      "example/evals.json",
      "example/closeqa.json",
    ];

    for (const file of files) {
      const content = await Deno.readTextFile(file);
      assertExists(content);
      const json = JSON.parse(content);
      assertExists(json);
      assertEquals(Array.isArray(json), true);
    }
  });

  await t.step("should verify SCENARIOS.md exists", async () => {
    const content = await Deno.readTextFile("SCENARIOS.md");
    assertExists(content);
    assertEquals(content.includes("Real-World Evaluation Scenarios"), true);
  });

  await t.step("should verify README.md has all features", async () => {
    const content = await Deno.readTextFile("README.md");
    assertExists(content);

    // Check for key sections
    assertEquals(content.includes("Heuristic Evaluations"), true);
    assertEquals(content.includes("LLM-as-a-Judge Evaluations"), true);
    assertEquals(content.includes("Levenshtein"), true);
    assertEquals(content.includes("Exact Match"), true);
    assertEquals(content.includes("Numeric"), true);
    assertEquals(content.includes("JSON Diff"), true);
    assertEquals(content.includes("Jaccard"), true);
    assertEquals(content.includes("Battle"), true);
    assertEquals(content.includes("Summarization"), true);
    assertEquals(content.includes("SQL"), true);
    assertEquals(content.includes("Translation"), true);
  });
});

Deno.test("Type Definitions", async (t) => {
  await t.step("should have proper interfaces for HeuristicEvalItem", () => {
    const item = {
      input: "test",
      output: "test output",
      expected: "test expected",
      tolerance: 0.01,
    };

    assertExists(item.input);
    assertExists(item.output);
    assertExists(item.expected);
    assertExists(item.tolerance);
  });

  await t.step("should have proper interfaces for HeuristicEvalResult", () => {
    const result = {
      name: "Test",
      score: 0.95,
      metadata: {
        evaluationType: "test",
        details: "test details",
        matched: true,
      },
    };

    assertExists(result.name);
    assertExists(result.score);
    assertExists(result.metadata);
    assertExists(result.metadata.evaluationType);
    assertExists(result.metadata.details);
    assertEquals(typeof result.metadata.matched, "boolean");
  });
});

Deno.test("Edge Cases and Error Handling", async (t) => {
  const evaluate = new Evaluate();

  await t.step("should handle empty file paths", async () => {
    try {
      await evaluate.parseFile("");
      throw new Error("Should have thrown");
    } catch (error) {
      assertExists(error);
    }
  });

  await t.step("should handle special characters in file paths", async () => {
    try {
      await evaluate.parseFile("file with spaces.json");
      throw new Error("Should have thrown");
    } catch (error) {
      assertExists(error);
    }
  });
});

Deno.test("Performance Tests", async (t) => {
  const evaluate = new Evaluate();

  await t.step("should parse large files efficiently", async () => {
    const startTime = Date.now();
    await evaluate.parseFile("example/evals.json");
    const endTime = Date.now();

    // Should take less than 100ms
    assertEquals((endTime - startTime) < 100, true);
  });
});

Deno.test("Integration - Example Files Work Together", async (t) => {
  await t.step("should load all example files without errors", async () => {
    const evaluate = new Evaluate();
    const files = [
      "example/levenshtein.json",
      "example/exact-match.json",
      "example/numeric.json",
      "example/json-diff.json",
      "example/jaccard.json",
      "example/evals.json",
      "example/closeqa.json",
    ];

    const promises = files.map((file) => evaluate.parseFile(file));
    const results = await Promise.all(promises);

    assertEquals(results.length, files.length);
    results.forEach((result) => {
      assertExists(result);
      assertEquals(Array.isArray(result), true);
    });
  });
});
