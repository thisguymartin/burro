# Burro 🫏

Burro is a command-line interface (CLI) tool built with Deno for evaluating
Large Language Model (LLM) outputs. It provides a straightforward way to run
different types of evaluations with secure API key management.

## 🚀 Features

- Three specialized evaluation types:
  - Close-ended QA matching
  - Simple output-expected comparison
- Secure OpenAI API key management
- JSON-based evaluation configurations
<!-- - SQLite storage for results and settings -->

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



# Burro CLI Installation Guide

## Installation

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

## Running Burro

After installation, simply run:
```bash
burro
```

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

## Uninstallation Guide

### MacOS & Linux
1. Remove the executable:
```bash
sudo rm /usr/local/bin/burro
```

2. Verify removal:
```bash
which burro
# Should return nothing if successfully removed
```

### Windows
1. Delete the executable:
   - Navigate to where you installed `burro.exe`
   - Delete the file

2. Remove from PATH (if added):
   - Open System Properties (Win + Pause|Break)
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables" or "User variables", find "Path"
   - Click "Edit"
   - Remove the directory containing burro.exe
   - Click "OK" to save changes

3. Verify removal:
```powershell
where.exe burro
# Should return nothing if successfully removed
```

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
