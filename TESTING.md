# Burro Testing Guide 🧪

Comprehensive testing documentation for Burro's evaluation system.

## Table of Contents
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Scenarios](#test-scenarios)
- [Writing New Tests](#writing-new-tests)
- [Continuous Integration](#continuous-integration)

---

## Test Structure

Burro includes comprehensive unit tests organized by functionality:

```
test/
├── heuristics_test.ts     # Heuristic evaluation tests
├── examples_test.ts       # Example file validation tests
├── scenarios_test.ts      # Real-world scenario tests
├── utils_test.ts          # Utility function tests
└── main_test.ts          # Integration tests (existing)
```

### Test Coverage

- **Heuristic Evaluations** - 100+ test cases
  - Levenshtein Distance (7 tests)
  - Exact Match (3 tests)
  - Case Insensitive Match (3 tests)
  - Numeric Difference (5 tests)
  - JSON Diff (6 tests)
  - Jaccard Similarity (4 tests)
  - Contains (4 tests)
  - Edge cases (5 tests)

- **Example Files** - 11 validation tests
  - All example files validated for structure
  - JSON parsing validation
  - Required field verification
  - Content validation

- **Real-World Scenarios** - 30+ scenario tests
  - Customer support bot evaluation
  - Code generation validation
  - Translation quality assessment
  - Data extraction accuracy
  - E-commerce product search
  - Math problem solving
  - And more...

- **Utilities** - 15+ utility tests
  - File parsing
  - Color utilities
  - Logo utilities
  - Error handling

---

## Running Tests

### Run All Tests

```bash
deno task test
```

### Run Specific Test Suites

```bash
# Heuristic evaluation tests
deno task test:heuristics

# Example file validation tests
deno task test:examples

# Real-world scenario tests
deno task test:scenarios

# Utility function tests
deno task test:utils
```

### Run Tests in Watch Mode

Automatically re-run tests when files change:

```bash
deno task test:watch
```

### Run Tests with Coverage

Generate code coverage report:

```bash
deno task test:coverage
```

### Run Individual Test Files

```bash
# Run a specific test file
deno test --allow-read --allow-write --allow-env test/heuristics_test.ts

# Run a specific test by name
deno test --allow-read --allow-write --allow-env test/heuristics_test.ts --filter "Levenshtein"
```

---

## Test Coverage

### Heuristic Evaluations

#### Levenshtein Distance Tests

```typescript
✅ should calculate perfect match (score = 1.0)
✅ should calculate similarity for close matches (score > 0.9)
✅ should calculate low score for very different strings (score = 0)
✅ should handle empty strings
✅ should handle special characters
```

**Example:**
```bash
deno task test:heuristics --filter "Levenshtein"
```

#### Exact Match Tests

```typescript
✅ should match identical strings
✅ should not match different strings
✅ should be case sensitive
✅ should handle empty strings
```

#### Numeric Difference Tests

```typescript
✅ should match exact numbers
✅ should match within tolerance
✅ should not match outside tolerance
✅ should handle invalid numbers
✅ should use default tolerance
✅ should handle very large numbers
```

#### JSON Diff Tests

```typescript
✅ should match identical JSON objects
✅ should match JSON with different key order
✅ should detect missing keys
✅ should detect extra keys
✅ should detect value differences
✅ should handle invalid JSON
✅ should handle nested objects
```

#### Jaccard Similarity Tests

```typescript
✅ should calculate perfect similarity for identical sets
✅ should calculate similarity for overlapping sets
✅ should handle no overlap
✅ should be case insensitive
```

---

## Test Scenarios

### Customer Support Bot Evaluation

Tests for validating chatbot responses in customer support contexts.

```typescript
Scenario: Customer Support Bot Evaluation
  ✅ should validate return policy response
  ✅ should validate shipping information
```

**Run:**
```bash
deno task test:scenarios --filter "Customer Support"
```

### Data Extraction Accuracy

Tests for validating data extraction from text.

```typescript
Scenario: Data Extraction Accuracy
  ✅ should extract order IDs exactly
  ✅ should extract prices with tolerance
  ✅ should extract structured JSON data
```

**Run:**
```bash
deno task test:scenarios --filter "Data Extraction"
```

### Translation Quality Assessment

Tests for validating translation outputs.

```typescript
Scenario: Translation Quality Assessment
  ✅ should validate exact translations
  ✅ should allow minor translation variations
```

**Run:**
```bash
deno task test:scenarios --filter "Translation"
```

### API Response Validation

Tests for validating API response structures.

```typescript
Scenario: API Response Validation
  ✅ should validate API response structure
  ✅ should detect missing fields in API response
  ✅ should detect extra fields in API response
```

**Run:**
```bash
deno task test:scenarios --filter "API Response"
```

---

## Writing New Tests

### Test Template

```typescript
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { HeuristicEval, HeuristicEvalItem } from "../src/services/heuristics.ts";

Deno.test("Your Feature Name", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should do something specific", () => {
    const item: HeuristicEvalItem = {
      input: "test input",
      output: "test output",
      expected: "expected output",
    };

    const result = evaluator.evaluateExactMatch(item);

    assertEquals(result.score, 1);
    assertEquals(result.metadata.matched, true);
  });

  await t.step("should handle edge case", () => {
    // Test edge case
  });
});
```

### Best Practices

1. **Use Descriptive Test Names**
   ```typescript
   // Good
   await t.step("should match identical strings", () => {});

   // Bad
   await t.step("test 1", () => {});
   ```

2. **Test One Thing Per Step**
   ```typescript
   // Good - focused test
   await t.step("should return score of 1 for exact match", () => {
     assertEquals(result.score, 1);
   });

   // Bad - testing too many things
   await t.step("should work correctly", () => {
     assertEquals(result.score, 1);
     assertEquals(result.metadata.matched, true);
     assertEquals(result.name, "Exact Match");
   });
   ```

3. **Include Edge Cases**
   - Empty strings
   - Null values
   - Very large numbers
   - Special characters
   - Invalid input

4. **Test Both Success and Failure Paths**
   ```typescript
   await t.step("should succeed with valid input", () => {
     // Test success
   });

   await t.step("should fail with invalid input", () => {
     // Test failure
   });
   ```

5. **Use Meaningful Assertions**
   ```typescript
   // Good
   assertEquals(result.score, 1, "Score should be 1 for perfect match");

   // Also good
   assertEquals(result.score > 0.9, true, "Score should be > 0.9 for close match");
   ```

---

## Example Tests

### Testing Levenshtein Distance

```typescript
Deno.test("Levenshtein - Typo Detection", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should detect single character typo", () => {
    const item: HeuristicEvalItem = {
      input: "Who wrote Hamlet?",
      output: "William Shakespear",  // Missing 'e'
      expected: "William Shakespeare",
    };

    const result = evaluator.evaluateLevenshtein(item);

    // Should have high similarity despite typo
    assertEquals(result.score > 0.9, true);
    assertEquals(result.score < 1, true);
  });
});
```

### Testing JSON Diff

```typescript
Deno.test("JSON Diff - API Response", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should detect missing field", () => {
    const item: HeuristicEvalItem = {
      input: "Get user data",
      output: '{"id": 123, "name": "John"}',
      expected: '{"id": 123, "name": "John", "email": "john@test.com"}',
    };

    const result = evaluator.evaluateJsonDiff(item);

    assertEquals(result.metadata.matched, false);
    assertEquals(result.metadata.details.includes("email"), true);
  });
});
```

### Testing Numeric Tolerance

```typescript
Deno.test("Numeric - Pi Calculation", async (t) => {
  const evaluator = new HeuristicEval();

  await t.step("should accept Pi approximation within tolerance", () => {
    const item: HeuristicEvalItem = {
      input: "Calculate Pi to 2 decimals",
      output: "3.14",
      expected: "3.14159",
      tolerance: 0.01,
    };

    const result = evaluator.evaluateNumericDifference(item);

    assertEquals(result.metadata.matched, true);
  });
});
```

---

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Deno
      uses: denoland/setup-deno@v1
      with:
        deno-version: v1.x

    - name: Run Tests
      run: deno task test

    - name: Generate Coverage
      run: deno task test:coverage
```

### Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
deno task test
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

---

## Test Results

### Expected Output

Running `deno task test` should produce:

```
Check file:///home/user/burro/test/heuristics_test.ts
Check file:///home/user/burro/test/examples_test.ts
Check file:///home/user/burro/test/scenarios_test.ts
Check file:///home/user/burro/test/utils_test.ts

running 4 tests from ./test/heuristics_test.ts
HeuristicEval - Levenshtein Distance ...
  should calculate perfect match ... ok (2ms)
  should calculate similarity for close matches ... ok (1ms)
  should calculate low score for very different strings ... ok (1ms)
HeuristicEval - Exact Match ...
  should match identical strings ... ok (1ms)
  should not match different strings ... ok (1ms)
  should be case sensitive ... ok (1ms)
...

test result: ok. 150 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (1500ms)
```

---

## Debugging Tests

### Run with Verbose Output

```bash
deno test --allow-read --allow-write --allow-env test/ --trace-ops
```

### Run Specific Test

```bash
deno test --allow-read --allow-write --allow-env test/heuristics_test.ts --filter "Levenshtein"
```

### Print Debug Information

```typescript
Deno.test("Debug Test", async (t) => {
  await t.step("should show debug info", () => {
    const result = evaluator.evaluateLevenshtein(item);
    console.log("Result:", result);
    console.log("Score:", result.score);
    console.log("Metadata:", result.metadata);
  });
});
```

---

## Performance Testing

### Measure Test Execution Time

```typescript
Deno.test("Performance - Large Dataset", async (t) => {
  await t.step("should process 100 items quickly", async () => {
    const items = generateLargeDataset(100);
    const startTime = Date.now();

    await evaluator.evaluateItems(items, "exact");

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete in under 1 second
    assertEquals(duration < 1000, true);
  });
});
```

---

## Code Coverage

### Generate Coverage Report

```bash
deno task test:coverage
```

### View Coverage

```bash
deno coverage coverage/
```

### Coverage Goals

- **Target**: 80% code coverage
- **Critical paths**: 95% coverage
- **Edge cases**: 70% coverage

---

## Troubleshooting

### Tests Failing

1. **Check Permissions**
   ```bash
   # Ensure proper flags are used
   deno test --allow-read --allow-write --allow-env test/
   ```

2. **Check File Paths**
   - Ensure example files exist
   - Verify paths are correct

3. **Check Dependencies**
   ```bash
   # Clear cache and reinstall
   deno cache --reload test/heuristics_test.ts
   ```

### Slow Tests

1. **Identify slow tests**
   ```bash
   deno test --allow-read --allow-write --allow-env test/ --trace-ops
   ```

2. **Optimize data generation**
3. **Use mocks for external services**

---

## Contributing Tests

When contributing new features:

1. **Write tests first** (TDD approach)
2. **Ensure all tests pass**
3. **Add documentation** to TESTING.md
4. **Run coverage** to ensure adequate coverage
5. **Submit PR** with tests included

---

## Resources

- [Deno Testing Documentation](https://deno.land/manual/testing)
- [Standard Assertions](https://deno.land/std/assert)
- [Test Coverage](https://deno.land/manual/testing/coverage)

---

**Happy Testing! 🧪✨**
