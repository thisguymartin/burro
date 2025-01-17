# Burro 🫏

Burro is a command-line interface (CLI) tool for evaluating Large Language Model (LLM) outputs. It provides a straightforward way to run different types of evaluations with secure API key management.

## 🚀 Features

- Three specialized evaluation types:
  - Answer correctness evaluation with context
  - Close-ended QA matching
  - Simple output-expected comparison
- Secure OpenAI API key management
- JSON-based evaluation configurations
<!-- - SQLite storage for results and settings -->

## 📋 Prerequisites

- OpenAI API key

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

## 🔧 Usage

### Setting up API Keys
```bash
burro set-openai-key
```

### Running Evaluations
```bash
burro run-eval <evaluation-file>
```

## 📊 Evaluation Types

### ✅ Current Evaluation Types


1. **Close QA** (closeqa.json) 
   - Exact matching for close-ended questions
   - Strict format validation
   - Support for multiple correct answers

2. **Simple Evals** (evals.json)
   - Basic output vs expected comparisons
   - Quick and efficient validation
   - Flexible matching options

### 🔜 Coming Soon

#### LLM-as-a-Judge Evaluations

Advanced evaluation methods using LLMs as judges:

🔜 **Battle**: Compare outputs from different models head-to-head
🔜 **Humor**: Evaluate the humor and wit in model responses
🔜 **Moderation**: Check content for safety and appropriateness
🔜 **Security**: Assess responses for potential security vulnerabilities
🔜 **Summarization**: Evaluate the quality and accuracy of text summaries
🔜 **SQL**: Verify the correctness of generated SQL queries
🔜 **Translation**: Assess translation quality across languages
🔜 **Fine-tuned binary classifiers**: Specialized evaluations using custom-trained models

#### Heuristic Evaluations

Mathematical and algorithmic comparison methods:

🔜 **Levenshtein distance**: Measure string similarity using edit distance
🔜 **Exact match**: Check for perfect matches between outputs
🔜 **Numeric difference**: Compare numerical values and tolerances
🔜 **JSON diff**: Analyze structural differences in JSON outputs
🔜 **Jaccard distance**: Calculate similarity between sets of tokens

### Current Evaluation Types


### 1. Close QA (closeqa.json)

Evaluates exact matching responses for close-ended questions.

Example format:
```json
{
  "input": "List the first three prime numbers in ascending order, separated by commas.",
  "output": "2,3,5",
  "criteria": "Numbers must be in correct order, separated by commas with no spaces"
}
```

### 2. Simple Evals (evals.json)

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

## System Architecture Check

To determine which version you should download, you can check your system's architecture:

### MacOS
```bash
uname -m
```
This will return:
- `arm64`: Use Apple Silicon version (M1/M2/M3 Macs)
- `x86_64`: Use Intel version

### Linux
```bash
uname -m
```
This will return:
- `aarch64` or `arm64`: Use Linux ARM version
- `x86_64`: Use Linux Intel version

## Troubleshooting

### Permission Denied
If you encounter permission issues during installation:
```bash
# Check current permissions
ls -l /usr/local/bin/burro

# Fix permissions if needed
sudo chmod +x /usr/local/bin/burro
```

### Command Not Found
If `burro` command is not found after installation:
1. Verify the installation location is in your PATH
2. Try restarting your terminal
3. Verify the executable exists and has proper permissions

## Uninstallation Guide

### MacOS & Linux
```bash
sudo rm /usr/local/bin/burro

# Verify removal
which burro  # Should return nothing if successfully removed
```

### Windows
1. Delete `burro.exe` from your installation location
2. If added to PATH:
   - Open System Properties (Win + Pause|Break)
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables" or "User variables", find "Path"
   - Click "Edit"
   - Remove the directory containing burro.exe
   - Click "OK" to save changes

Verify removal:
```powershell
where.exe burro  # Should return nothing if successfully removed
```