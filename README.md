# Burro 🫏
<<<<<<< Updated upstream
=======

Burro is a command-line interface (CLI) tool built with Deno for evaluating Large Language Model (LLM) outputs. It provides a straightforward way to run different types of evaluations with secure API key management.

## 🚀 Features

- Three specialized evaluation types:
  - Answer correctness evaluation with context
  - Close-ended QA matching
  - Simple output-expected comparison
- Secure OpenAI API key management
- JSON-based evaluation configurations
- SQLite storage for results and settings

## 📋 Prerequisites

- [Deno](https://deno.land/) installed on your system
- OpenAI API key

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd burro
```

2. Ensure Deno is installed:
```bash
deno --version
```

## 🔧 Usage

### Setting up API Keys

```bash
deno run --allow-read --allow-write --allow-env main.ts set-openai-key
```

### Running Evaluations

```bash
deno run --allow-read --allow-write --allow-env main.ts run-eval <evaluation-file>
```

## 📊 Evaluation Types

### 1. Answer Correctness (answerCorrectness.json)
Evaluates answers against provided context with specific criteria.

Example format:
```json
{
  "input": {
    "context": "Tesla's Model 3 was first unveiled on March 31, 2016...",
    "question": "When did Tesla start delivering the Model 3?"
  },
  "output": "July 2017",
  "criteria": "Answer must be exactly 'July 2017' based on the provided context"
}
```

### 2. Close QA (closeqa.json)
Evaluates exact matching responses for close-ended questions.

Example format:
```json
{
  "input": "List the first three prime numbers in ascending order, separated by commas.",
  "output": "2,3,5",
  "criteria": "Numbers must be in correct order, separated by commas with no spaces"
}
```

### 3. Simple Evals (evals.json)
Compares model outputs against expected answers.

Example format:
```json
{
  "input": "What is the capital of France?",
  "output": "The capital city of France is Paris",
  "expected": "Paris"
}
```


## 🔒 Security Features

- AES encryption for API key storage
- Secure key generation
- Encrypted SQLite storage

## 📦 Dependencies

- [cliffy](https://deno.land/x/cliffy) - Command-line framework
- [sqlite](https://deno.land/x/sqlite) - Database operations
- [autoevals](https://deno.land/x/autoevals) - Evaluation utilities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Potential areas for contribution:
- Additional evaluation types
- Improved scoring mechanisms
- Enhanced output formatting
- Documentation improvements
>>>>>>> Stashed changes
