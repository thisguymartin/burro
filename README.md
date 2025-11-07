# Burro 🫏

**Burro** is a powerful command-line interface (CLI) tool for evaluating Large Language Model (LLM) outputs. It provides both heuristic and LLM-based evaluation methods with secure API key management.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deno](https://img.shields.io/badge/deno-%5E1.37-green)](https://deno.land/)

## 🚀 Features

> **📖 For detailed feature documentation, see [FEATURES.md](FEATURES.md)**

### Evaluation Methods

**📊 Heuristic Evaluations** (No API key required)
- **Levenshtein Distance** - Measure string similarity using edit distance
- **Exact Match** - Perfect matching for IDs, codes, and specific formats
- **Case Insensitive Match** - Flexible text matching
- **Numeric Difference** - Compare numerical values with configurable tolerance
- **JSON Diff** - Analyze structural differences in JSON outputs
- **Jaccard Similarity** - Calculate similarity between sets of tokens
- **Contains** - Verify if expected value appears in output

**🤖 LLM-as-a-Judge Evaluations** (Requires OpenAI API key)
- **Factuality** - Answer correctness with context validation
- **Close QA** - Close-ended question matching
- **Battle** - Compare outputs from different models head-to-head
- **Summarization** - Evaluate summary quality and accuracy
- **SQL** - Verify correctness of generated SQL queries
- **Translation** - Assess translation quality across languages

### Additional Features
- 🔒 Secure OpenAI API key management with AES encryption
- 📈 Progress indicators for long-running evaluations
- 💾 Export results to JSON format
- 🎯 Comprehensive error handling and validation
- 🚀 Cross-platform support (Mac, Linux, Windows)
- ⚡ Fast execution with Deno runtime

## 📋 Prerequisites

- **For Heuristic Evaluations**: None! Works out of the box
- **For LLM-based Evaluations**: OpenAI API key

## 🛠️ Installation

### MacOS - Apple Silicon (M1/M2/M3)
```bash
sudo curl -L "https://github.com/thisguymartin/burro/releases/download/latest/build-mac-silicon" -o /usr/local/bin/burro && sudo chmod +x /usr/local/bin/burro
```

### MacOS - Intel
```bash
sudo curl -L "https://github.com/thisguymartin/burro/releases/download/latest/build-mac-intel" -o /usr/local/bin/burro && sudo chmod +x /usr/local/bin/burro
```

### Linux - ARM
```bash
sudo curl -L "https://github.com/thisguymartin/burro/releases/download/latest/build-linux-arm" -o /usr/local/bin/burro && sudo chmod +x /usr/local/bin/burro
```

### Linux - Intel
```bash
sudo curl -L "https://github.com/thisguymartin/burro/releases/download/latest/build-linux-intel" -o /usr/local/bin/burro && sudo chmod +x /usr/local/bin/burro
```

### Windows
1. Download `build-windows.exe` from the [releases page](https://github.com/thisguymartin/burro/releases)
2. Rename it to `burro.exe`
3. Move it to your desired location (e.g., `C:\Program Files\burro\burro.exe`)

## 🔧 Quick Start

### 1. Set up API Key (for LLM-based evaluations only)
```bash
burro set-openai-key
```

### 2. Run Your First Evaluation

**Heuristic Evaluation (no API key needed):**
```bash
burro run-eval -t exact example/exact-match.json
```

**LLM-based Evaluation:**
```bash
burro run-eval -t factuality example/evals.json
```

**With progress indicators and result export:**
```bash
burro run-eval -t levenshtein example/levenshtein.json --progress -p
```

## 📊 Evaluation Types Guide

### Heuristic Evaluations

#### Levenshtein Distance
Measures string similarity using edit distance. Great for catching typos and minor variations.

**Example: `example/levenshtein.json`**
```json
[
  {
    "input": "Who wrote Hamlet?",
    "output": "William Shakespear",
    "expected": "William Shakespeare"
  }
]
```

**Run:**
```bash
burro run-eval -t levenshtein example/levenshtein.json
```

---

#### Exact Match
Perfect matching for critical data like IDs, codes, or specific formats.

**Example: `example/exact-match.json`**
```json
[
  {
    "input": "What is the ISO code for United States?",
    "output": "US",
    "expected": "US"
  }
]
```

**Run:**
```bash
burro run-eval -t exact example/exact-match.json
```

---

#### Numeric Difference
Compare numerical values with configurable tolerance.

**Example: `example/numeric.json`**
```json
[
  {
    "input": "What is the value of Pi to 2 decimal places?",
    "output": "3.14",
    "expected": "3.14159",
    "tolerance": 0.01
  }
]
```

**Run:**
```bash
burro run-eval -t numeric example/numeric.json
```

---

#### JSON Diff
Analyze structural differences in JSON outputs.

**Example: `example/json-diff.json`**
```json
[
  {
    "input": "Convert user data to JSON",
    "output": "{\"name\": \"John Doe\", \"age\": 30}",
    "expected": "{\"name\": \"John Doe\", \"age\": 30}"
  }
]
```

**Run:**
```bash
burro run-eval -t json example/json-diff.json
```

---

#### Jaccard Similarity
Calculate similarity between sets of tokens.

**Example: `example/jaccard.json`**
```json
[
  {
    "input": "List programming languages for web development",
    "output": "JavaScript TypeScript Python Ruby PHP Java",
    "expected": "JavaScript Python Ruby PHP Go"
  }
]
```

**Run:**
```bash
burro run-eval -t jaccard example/jaccard.json
```

---

### LLM-as-a-Judge Evaluations

#### Factuality
Evaluate answer correctness with context validation.

**Example: `example/evals.json`**
```json
[
  {
    "input": "What is the capital of France?",
    "output": "The capital city of France is Paris",
    "expected": "Paris"
  }
]
```

**Run:**
```bash
burro run-eval -t factuality example/evals.json
```

---

#### Close QA
Exact matching for close-ended questions.

**Example: `example/closeqa.json`**
```json
[
  {
    "input": "List the first three prime numbers",
    "output": "2,3,5",
    "criteria": "Numbers must be in correct order, separated by commas"
  }
]
```

**Run:**
```bash
burro run-eval -t closeqa example/closeqa.json
```

---

#### Battle
Compare outputs from different models head-to-head.

**Example: `example/battle.json`**
```json
[
  {
    "input": "Write a haiku about technology",
    "output": "Code flows like water\nBits and bytes dance in rhythm\nDigital zen speaks",
    "expected": "Silicon pathways\nData streams through endless night\nMachines dream in code"
  }
]
```

**Run:**
```bash
burro run-eval -t battle example/battle.json
```

---

#### Summarization
Evaluate the quality and accuracy of text summaries.

**Example: `example/summarization.json`**
```json
[
  {
    "input": "Summarize this text",
    "output": "Climate change impacts polar regions; urgent global action needed.",
    "context": "Long article about climate change effects..."
  }
]
```

**Run:**
```bash
burro run-eval -t summarization example/summarization.json
```

---

#### SQL
Verify the correctness of generated SQL queries.

**Example: `example/sql.json`**
```json
[
  {
    "input": "Find all users over age 18",
    "output": "SELECT * FROM users WHERE age > 18;",
    "expected": "SELECT * FROM users WHERE age > 18;",
    "context": "Database schema: users(id, name, email, age)"
  }
]
```

**Run:**
```bash
burro run-eval -t sql example/sql.json
```

---

#### Translation
Assess translation quality across languages.

**Example: `example/translation.json`**
```json
[
  {
    "input": "Translate 'Hello' to Spanish",
    "output": "Hola",
    "expected": "Hola"
  }
]
```

**Run:**
```bash
burro run-eval -t translation example/translation.json
```

---

## 📖 Real-World Scenarios

See [SCENARIOS.md](SCENARIOS.md) for comprehensive real-world examples including:

- 🎯 Customer Support Bot Evaluation
- 💻 Code Generation Validation
- 🌍 Translation Quality Assessment
- ⚔️ Chatbot Response Comparison
- 📊 Data Extraction Accuracy
- 📚 Educational Content Assessment

## 🔒 Security Features

- **AES-256 Encryption** for API key storage
- **Secure key generation** using Web Crypto API
- **Encrypted SQLite storage** for settings
- **No plaintext secrets** ever stored on disk

## 📈 Advanced Usage

### Progress Indicators
For long-running evaluations:
```bash
burro run-eval -t factuality large-dataset.json --progress
```

### Export Results
Save evaluation results to JSON:
```bash
burro run-eval -t battle comparison.json -p
# Results saved to ~/Downloads/comparison.json-result.json
```

### Batch Evaluation
Run multiple evaluations sequentially:
```bash
burro run-eval -t exact tests/ids.json
burro run-eval -t factuality tests/qa.json
burro run-eval -t sql tests/queries.json
```

## 🎯 Choosing the Right Evaluation Type

| Use Case | Recommended Type | Why? |
|----------|------------------|------|
| Order IDs, Product Codes | `exact` | Requires perfect match |
| User Questions | `factuality` | Needs semantic understanding |
| Price Calculations | `numeric` | Allows tolerance |
| Model A/B Testing | `battle` | Direct comparison |
| API Responses | `json` | Structure validation |
| Spelling Variations | `levenshtein` | Fuzzy matching |
| Keywords/Tags | `jaccard` | Set similarity |
| Summaries | `summarization` | Quality assessment |
| SQL Queries | `sql` | Syntax + logic validation |
| Translations | `translation` | Language expertise |

## 🏗️ System Architecture Check

To determine which version to download:

### MacOS
```bash
uname -m
```
- `arm64` → Use Apple Silicon version (M1/M2/M3)
- `x86_64` → Use Intel version

### Linux
```bash
uname -m
```
- `aarch64` or `arm64` → Use ARM version
- `x86_64` → Use Intel version

## 🐛 Troubleshooting

### Permission Denied
```bash
sudo chmod +x /usr/local/bin/burro
```

### Command Not Found
1. Verify installation location is in your PATH
2. Restart your terminal
3. Check executable exists: `ls -l /usr/local/bin/burro`

### API Key Issues
```bash
burro set-openai-key  # Re-enter your API key
```

### Low Evaluation Scores
- **Exact match**: Check for extra spaces or case differences
- **Numeric**: Adjust tolerance values
- **JSON**: Ensure consistent formatting
- **Factuality**: Make expected answers less specific

## 🗑️ Uninstallation

### MacOS & Linux
```bash
sudo rm /usr/local/bin/burro
which burro  # Should return nothing
```

### Windows
1. Delete `burro.exe` from installation location
2. Remove from PATH if added

## 🎓 Examples Directory

All evaluation types have examples in the `/example` directory:

```
example/
├── closeqa.json           # Close-ended QA
├── evals.json            # Factuality evaluation
├── levenshtein.json      # String similarity
├── exact-match.json      # Exact matching
├── numeric.json          # Numeric comparison
├── json-diff.json        # JSON structure diff
├── jaccard.json          # Token similarity
├── battle.json           # Model comparison
├── summarization.json    # Summary quality
├── sql.json             # SQL validation
└── translation.json      # Translation quality
```

## 🚀 Getting Started Tutorial

1. **Install Burro** using the command for your platform
2. **Try a heuristic evaluation** (no API key needed):
   ```bash
   burro run-eval -t exact example/exact-match.json
   ```
3. **Set up your API key** for LLM evaluations:
   ```bash
   burro set-openai-key
   ```
4. **Run an LLM evaluation**:
   ```bash
   burro run-eval -t factuality example/evals.json
   ```
5. **Explore scenarios** in [SCENARIOS.md](SCENARIOS.md)
6. **Create your own** evaluation files based on examples

## 💡 Tips for Success

1. **Start with heuristics** - They're fast and free
2. **Use the right tool** - Match evaluation type to your use case
3. **Build incrementally** - Start with 5-10 test cases
4. **Version your tests** - Track evaluation files in git
5. **Automate regularly** - Run evaluations as part of your workflow
6. **Compare methods** - Try multiple evaluation types on the same data
7. **Check examples** - Learn from provided examples in `/example` directory

## 📚 Documentation

- **[FEATURES.md](FEATURES.md)** - Complete feature documentation and technical details
- **[SCENARIOS.md](SCENARIOS.md)** - Real-world use cases and examples
- **[/example](example/)** - Sample evaluation files for all types
- **README.md** - This file, quick start guide and overview

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use Burro in your projects!

## 🎯 Next Steps

Ready to evaluate your LLM outputs?

1. Install Burro for your platform
2. Pick an evaluation type that matches your needs
3. Create or use an example evaluation file
4. Run your first evaluation
5. Iterate and improve!

Need help? Check the [issues page](https://github.com/thisguymartin/burro/issues) or review the examples!

---

**Made with ❤️ for LLM developers and evaluators**
