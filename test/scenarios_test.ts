import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { HeuristicEval, HeuristicEvalItem } from "../src/services/heuristics.ts";

Deno.test("Scenario: Customer Support Bot Evaluation", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate return policy response", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "What is your return policy?",
        output:
          "We offer a 30-day return policy for all unused items in original packaging.",
        expected: "30-day return policy",
      },
    ];

    const results = await heuristic.evaluateItems(items, "contains");
    assertEquals(results[0].metadata.matched, true);
  });

  await t.step("should validate shipping information", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Do you ship internationally?",
        output: "Yes, we ship to over 50 countries worldwide.",
        expected: "Yes we ship internationally",
      },
    ];

    const results = await heuristic.evaluateItems(items, "jaccard");
    assertEquals(results[0].score > 0.3, true);
  });
});

Deno.test("Scenario: Code Generation Validation", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate SQL query structure", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Get all active users",
        output: "SELECT * FROM users WHERE status = 'active';",
        expected: "SELECT * FROM users WHERE status = 'active';",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results[0].score, 1);
  });

  await t.step("should validate SQL with minor differences", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Get all active users",
        output: "SELECT * FROM users WHERE status = 'active'",
        expected: "SELECT * FROM users WHERE status = 'active';",
      },
    ];

    const results = await heuristic.evaluateItems(items, "levenshtein");
    assertEquals(results[0].score > 0.95, true);
  });
});

Deno.test("Scenario: Translation Quality Assessment", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate exact translations", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Translate 'Hello' to Spanish",
        output: "Hola",
        expected: "Hola",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results[0].score, 1);
  });

  await t.step("should allow minor translation variations", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Translate 'Good morning' to French",
        output: "Bonjour",
        expected: "Bonjour",
      },
    ];

    const results = await heuristic.evaluateItems(items, "levenshtein");
    assertEquals(results[0].score, 1);
  });
});

Deno.test("Scenario: Data Extraction Accuracy", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should extract order IDs exactly", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Extract the order ID: Your order #ORD-12345 has been shipped",
        output: "ORD-12345",
        expected: "ORD-12345",
      },
      {
        input: "Find the tracking number: Tracking: 1Z999AA10123456784",
        output: "1Z999AA10123456784",
        expected: "1Z999AA10123456784",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results.every((r) => r.score === 1), true);
  });

  await t.step("should extract prices with tolerance", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "What's the price? The item costs $49.99",
        output: "49.99",
        expected: "49.99",
        tolerance: 0.01,
      },
      {
        input: "Extract the total: Your total is $123.45",
        output: "123.45",
        expected: "123.45",
        tolerance: 0.01,
      },
    ];

    const results = await heuristic.evaluateItems(items, "numeric");
    assertEquals(results.every((r) => r.metadata.matched), true);
  });

  await t.step("should extract structured JSON data", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Extract: John Doe, johndoe@email.com, 555-1234",
        output: '{"name":"John Doe","email":"johndoe@email.com","phone":"555-1234"}',
        expected: '{"name":"John Doe","email":"johndoe@email.com","phone":"555-1234"}',
      },
    ];

    const results = await heuristic.evaluateItems(items, "json");
    assertEquals(results[0].score, 1);
  });
});

Deno.test("Scenario: Educational Content Assessment", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate key concepts are present", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Explain photosynthesis",
        output:
          "Photosynthesis is how plants make food using sunlight, water, and carbon dioxide.",
        expected: "plants sunlight water carbon dioxide",
      },
    ];

    const results = await heuristic.evaluateItems(items, "jaccard");
    assertEquals(results[0].score > 0.6, true);
  });

  await t.step("should validate definitions contain key terms", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Define machine learning",
        output:
          "Machine learning is a subset of AI that enables computers to learn from data without explicit programming.",
        expected: "data",
      },
    ];

    const results = await heuristic.evaluateItems(items, "contains");
    assertEquals(results[0].metadata.matched, true);
  });
});

Deno.test("Scenario: API Response Validation", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate API response structure", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Get user profile",
        output: '{"id":123,"name":"John","email":"john@example.com"}',
        expected: '{"id":123,"name":"John","email":"john@example.com"}',
      },
    ];

    const results = await heuristic.evaluateItems(items, "json");
    assertEquals(results[0].score, 1);
  });

  await t.step("should detect missing fields in API response", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Get user profile",
        output: '{"id":123,"name":"John"}',
        expected: '{"id":123,"name":"John","email":"john@example.com"}',
      },
    ];

    const results = await heuristic.evaluateItems(items, "json");
    assertEquals(results[0].metadata.matched, false);
    assertEquals(results[0].metadata.details.includes("email"), true);
  });

  await t.step("should detect extra fields in API response", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Get user profile",
        output: '{"id":123,"name":"John","email":"john@example.com","age":30}',
        expected: '{"id":123,"name":"John","email":"john@example.com"}',
      },
    ];

    const results = await heuristic.evaluateItems(items, "json");
    assertEquals(results[0].metadata.matched, false);
  });
});

Deno.test("Scenario: Chatbot Response Quality", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate greeting responses", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Hello",
        output: "Hello! How can I help you today?",
        expected: "Hello",
      },
    ];

    const results = await heuristic.evaluateItems(items, "contains");
    assertEquals(results[0].metadata.matched, true);
  });

  await t.step("should validate information accuracy", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "What is the capital of France?",
        output: "The capital of France is Paris.",
        expected: "Paris",
      },
    ];

    const results = await heuristic.evaluateItems(items, "contains");
    assertEquals(results[0].metadata.matched, true);
  });
});

Deno.test("Scenario: Form Validation", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate email format", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Extract email",
        output: "user@example.com",
        expected: "user@example.com",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results[0].score, 1);
  });

  await t.step("should validate phone number format", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Extract phone",
        output: "555-1234",
        expected: "555-1234",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results[0].score, 1);
  });

  await t.step("should allow phone number format variations", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Extract phone",
        output: "(555) 123-4567",
        expected: "555-123-4567",
      },
    ];

    const results = await heuristic.evaluateItems(items, "levenshtein");
    assertEquals(results[0].score > 0.8, true);
  });
});

Deno.test("Scenario: Content Moderation", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should detect prohibited keywords", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Check content",
        output: "This is a family-friendly message",
        expected: "spam",
      },
    ];

    const results = await heuristic.evaluateItems(items, "contains");
    assertEquals(results[0].metadata.matched, false);
  });

  await t.step("should validate content classification", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Classify content",
        output: "safe",
        expected: "safe",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results[0].score, 1);
  });
});

Deno.test("Scenario: Multi-Language Support", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate Spanish translations", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Translate 'Thank you' to Spanish",
        output: "Gracias",
        expected: "Gracias",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results[0].score, 1);
  });

  await t.step("should validate French translations", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Translate 'Good morning' to French",
        output: "Bonjour",
        expected: "Bonjour",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results[0].score, 1);
  });
});

Deno.test("Scenario: E-commerce Product Search", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should match product names exactly", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Find product",
        output: "iPhone 15 Pro Max",
        expected: "iPhone 15 Pro Max",
      },
    ];

    const results = await heuristic.evaluateItems(items, "exact");
    assertEquals(results[0].score, 1);
  });

  await t.step("should match product names with typos", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Find product",
        output: "iPhone 15 Pro Max",
        expected: "iPhone 15 Pro Maxx",
      },
    ];

    const results = await heuristic.evaluateItems(items, "levenshtein");
    assertEquals(results[0].score > 0.9, true);
  });

  await t.step("should match product by keywords", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Search products",
        output: "smartphone 5G camera wireless charging",
        expected: "smartphone camera wireless",
      },
    ];

    const results = await heuristic.evaluateItems(items, "jaccard");
    assertEquals(results[0].score > 0.5, true);
  });
});

Deno.test("Scenario: Math Problem Solving", async (t) => {
  const heuristic = new HeuristicEval();

  await t.step("should validate exact numeric answers", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "What is 2 + 2?",
        output: "4",
        expected: "4",
        tolerance: 0,
      },
    ];

    const results = await heuristic.evaluateItems(items, "numeric");
    assertEquals(results[0].score, 1);
  });

  await t.step("should validate floating point calculations", async () => {
    const items: HeuristicEvalItem[] = [
      {
        input: "Calculate 10 / 3",
        output: "3.33",
        expected: "3.333",
        tolerance: 0.01,
      },
    ];

    const results = await heuristic.evaluateItems(items, "numeric");
    assertEquals(results[0].metadata.matched, true);
  });
});
