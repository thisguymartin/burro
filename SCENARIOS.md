# Real-World Evaluation Scenarios 🌍

This guide provides practical scenarios for using Burro in real-world LLM evaluation tasks.

## Table of Contents
- [Customer Support Bot Evaluation](#customer-support-bot-evaluation)
- [Code Generation Validation](#code-generation-validation)
- [Translation Quality Assessment](#translation-quality-assessment)
- [Chatbot Response Comparison](#chatbot-response-comparison)
- [Data Extraction Accuracy](#data-extraction-accuracy)
- [Educational Content Assessment](#educational-content-assessment)

---

## Customer Support Bot Evaluation

### Scenario
You're building a customer support chatbot and need to evaluate its responses against expected answers.

### Example Files

**scenario-support-factuality.json**
```json
[
  {
    "input": "What is your return policy?",
    "output": "We offer a 30-day return policy for all unused items in original packaging.",
    "expected": "30-day return policy for unused items"
  },
  {
    "input": "Do you ship internationally?",
    "output": "Yes, we ship to over 50 countries worldwide.",
    "expected": "International shipping available"
  }
]
```

**How to Run:**
```bash
burro run-eval -t factuality scenario-support-factuality.json --progress
```

**Use Case:** Verify that your chatbot provides factually correct information about company policies.

---

## Code Generation Validation

### Scenario
You have an AI code assistant and need to validate that generated SQL queries are correct.

### Example File

**scenario-sql-validation.json**
```json
[
  {
    "input": "Get all active users who signed up in the last 30 days",
    "output": "SELECT * FROM users WHERE status = 'active' AND signup_date >= DATE_SUB(NOW(), INTERVAL 30 DAY);",
    "expected": "SELECT * FROM users WHERE status = 'active' AND created_at >= NOW() - INTERVAL '30 days';",
    "context": "Database: MySQL, Table: users(id, email, status, signup_date)"
  }
]
```

**How to Run:**
```bash
burro run-eval -t sql scenario-sql-validation.json --progress -p
```

**Use Case:** Validate that AI-generated SQL queries are semantically correct and follow best practices.

---

## Translation Quality Assessment

### Scenario
Evaluating a translation model's output quality across multiple languages.

### Example File

**scenario-translation-quality.json**
```json
[
  {
    "input": "Translate to Spanish: 'The meeting is scheduled for tomorrow at 3 PM'",
    "output": "La reunión está programada para mañana a las 3 PM",
    "expected": "La reunión está programada para mañana a las 15:00"
  },
  {
    "input": "Translate to French: 'Please send me the report by end of day'",
    "output": "Veuillez m'envoyer le rapport avant la fin de la journée",
    "expected": "Veuillez m'envoyer le rapport d'ici la fin de la journée"
  }
]
```

**How to Run:**
```bash
burro run-eval -t translation scenario-translation-quality.json
```

**Use Case:** Compare translation quality and ensure consistency across your translation system.

---

## Chatbot Response Comparison (Battle Mode)

### Scenario
You're testing two different LLM models and want to compare which provides better responses.

### Example File

**scenario-model-comparison.json**
```json
[
  {
    "input": "Explain blockchain technology to a 10-year-old",
    "output": "Imagine a notebook that everyone can write in, but nobody can erase what's already written. That's blockchain!",
    "expected": "Think of it like a digital diary that lots of people share. When someone writes something, everyone sees it and nobody can change it later."
  },
  {
    "input": "What's the best way to learn programming?",
    "output": "Start with a beginner-friendly language like Python, practice daily with small projects, and don't be afraid to make mistakes.",
    "expected": "Choose one language to start with, build real projects that interest you, and join communities where you can ask questions and learn from others."
  }
]
```

**How to Run:**
```bash
burro run-eval -t battle scenario-model-comparison.json --progress
```

**Use Case:** A/B test different model outputs to determine which provides more helpful, clear responses.

---

## Data Extraction Accuracy

### Scenario
Your AI extracts structured data from unstructured text. Validate the accuracy using different methods.

### Example Files

**scenario-extraction-exact.json** (Exact matching for IDs/codes)
```json
[
  {
    "input": "Extract the order ID: Your order #ORD-12345 has been shipped",
    "output": "ORD-12345",
    "expected": "ORD-12345"
  },
  {
    "input": "Find the tracking number: Tracking: 1Z999AA10123456784",
    "output": "1Z999AA10123456784",
    "expected": "1Z999AA10123456784"
  }
]
```

**scenario-extraction-json.json** (Structured data extraction)
```json
[
  {
    "input": "Extract: John Doe, johndoe@email.com, 555-1234",
    "output": "{\"name\": \"John Doe\", \"email\": \"johndoe@email.com\", \"phone\": \"555-1234\"}",
    "expected": "{\"name\": \"John Doe\", \"email\": \"johndoe@email.com\", \"phone\": \"555-1234\"}"
  }
]
```

**scenario-extraction-numeric.json** (Price/number extraction)
```json
[
  {
    "input": "What's the price? The item costs $49.99",
    "output": "49.99",
    "expected": "49.99",
    "tolerance": 0.01
  }
]
```

**How to Run:**
```bash
# Exact matching for IDs
burro run-eval -t exact scenario-extraction-exact.json

# JSON structure validation
burro run-eval -t json scenario-extraction-json.json

# Numeric accuracy check
burro run-eval -t numeric scenario-extraction-numeric.json
```

**Use Case:** Validate data extraction accuracy for different data types with appropriate evaluation methods.

---

## Educational Content Assessment

### Scenario
You're building an AI tutor and need to evaluate the quality of generated summaries and explanations.

### Example File

**scenario-educational-summarization.json**
```json
[
  {
    "input": "Summarize this concept for students",
    "output": "Photosynthesis is how plants make food using sunlight, water, and carbon dioxide. They produce oxygen as a byproduct, which we breathe.",
    "context": "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy. During photosynthesis, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds. The process occurs in chloroplasts and involves complex biochemical reactions including light-dependent and light-independent reactions. The overall equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2."
  }
]
```

**How to Run:**
```bash
burro run-eval -t summarization scenario-educational-summarization.json --progress
```

**Use Case:** Ensure AI-generated educational content is accurate, concise, and appropriate for the target audience.

---

## Complete Workflow Example

### Multi-Stage Evaluation Pipeline

For comprehensive testing, you might want to run multiple evaluation types:

```bash
# 1. Test exact matching for critical data
burro run-eval -t exact tests/critical-data.json

# 2. Check factuality of responses
burro run-eval -t factuality tests/factual-responses.json --progress

# 3. Validate code generation
burro run-eval -t sql tests/sql-generation.json -p

# 4. Compare with baseline model
burro run-eval -t battle tests/model-comparison.json

# 5. Test fuzzy matching for similar responses
burro run-eval -t levenshtein tests/fuzzy-responses.json
```

---

## Best Practices

### 1. Choose the Right Evaluation Type

| Evaluation Type | Best For | When to Use |
|----------------|----------|-------------|
| **Exact Match** | IDs, codes, specific formats | When precision is critical |
| **Levenshtein** | Typos, minor variations | When small differences are acceptable |
| **Numeric** | Prices, measurements, calculations | For numerical accuracy with tolerance |
| **JSON Diff** | Structured data extraction | API responses, data parsing |
| **Jaccard** | Keyword matching, tags | Content similarity by words |
| **Contains** | Key phrase verification | When expected value must appear |
| **Factuality** | Knowledge accuracy | Factual information verification |
| **Battle** | Model comparison | A/B testing different models |
| **Summarization** | Content condensing | Summary quality evaluation |
| **SQL** | Query generation | Database query validation |
| **Translation** | Language conversion | Translation accuracy |

### 2. Organize Your Test Files

```
evaluations/
├── critical/          # Exact match tests
│   ├── ids.json
│   └── codes.json
├── factual/          # Factuality checks
│   ├── support.json
│   └── product-info.json
├── fuzzy/            # Levenshtein tests
│   └── general-qa.json
└── structured/       # JSON/SQL tests
    ├── data-extraction.json
    └── query-generation.json
```

### 3. Use Progress Indicators for Long Tests

```bash
burro run-eval -t factuality large-dataset.json --progress
```

### 4. Save Results for Analysis

```bash
burro run-eval -t battle comparison.json -p
# Results saved to ~/Downloads/comparison.json-result.json
```

### 5. Combine Multiple Evaluation Types

Test the same dataset with different methods to get comprehensive insights:

```bash
# Test exact match first
burro run-eval -t exact data.json

# Then check with fuzzy matching
burro run-eval -t levenshtein data.json

# Finally, check semantic correctness
burro run-eval -t factuality data.json
```

---

## Tips for Creating Good Test Cases

1. **Start Small**: Begin with 5-10 test cases and expand
2. **Cover Edge Cases**: Include unusual inputs and expected failures
3. **Use Real Data**: Test with actual user queries when possible
4. **Set Appropriate Tolerances**: For numeric tests, choose realistic tolerance values
5. **Document Context**: Include necessary context for LLM-based evaluations
6. **Version Your Tests**: Track changes to your test datasets
7. **Regular Updates**: Refresh test cases based on production issues

---

## Troubleshooting Common Issues

### Issue: Low scores on factuality tests
**Solution**: Ensure your expected answers contain the key information without being too specific.

### Issue: JSON diff finding too many differences
**Solution**: Normalize your JSON (sort keys, consistent formatting) before comparison.

### Issue: Numeric tests failing
**Solution**: Adjust tolerance values to account for floating-point precision.

### Issue: Levenshtein scores lower than expected
**Solution**: Consider using Jaccard or Contains if order doesn't matter.

---

## Next Steps

- Create your first evaluation file based on these examples
- Start with the evaluation type that best matches your use case
- Iterate on your test cases based on results
- Build a comprehensive test suite over time
- Automate evaluations in your CI/CD pipeline (coming soon!)

Happy evaluating! 🎯
