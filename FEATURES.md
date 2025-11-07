# Burro Features Documentation 🫏

Complete guide to all features and capabilities of Burro - the LLM evaluation CLI tool.

## Table of Contents

- [Core Features](#core-features)
- [Evaluation Methods](#evaluation-methods)
  - [Heuristic Evaluations](#heuristic-evaluations)
  - [LLM-as-a-Judge Evaluations](#llm-as-a-judge-evaluations)
- [Security Features](#security-features)
- [CLI Features](#cli-features)
- [Output & Results](#output--results)
- [Advanced Features](#advanced-features)
- [Platform Support](#platform-support)

---

## Core Features

### 1. Dual Evaluation Approach

Burro provides two distinct evaluation paradigms to suit different use cases:

**Heuristic Evaluations**
- No API key required
- Instant results
- Deterministic outcomes
- Cost-free operation
- Ideal for objective comparisons

**LLM-as-a-Judge Evaluations**
- Powered by OpenAI API
- Semantic understanding
- Context-aware evaluation
- Natural language assessment
- Best for subjective quality checks

### 2. Flexible Input Format

All evaluations use simple JSON files with a consistent structure:

```json
[
  {
    "input": "The question or prompt",
    "output": "The actual LLM output",
    "expected": "The expected/reference output",
    "context": "Optional additional context",
    "tolerance": "Optional for numeric evaluations"
  }
]
```

### 3. Cross-Platform CLI Tool

- **Single binary** - No dependencies or runtime required
- **Native performance** - Compiled for each platform
- **System integration** - Works with standard CLI tools
- **Path installation** - Global command access

---

## Evaluation Methods

### Heuristic Evaluations

All heuristic evaluations work **without an API key** and provide instant, deterministic results.

#### 1. Levenshtein Distance

**Purpose**: Measure string similarity using edit distance (insertions, deletions, substitutions).

**Best For**:
- Catching typos and spelling errors
- Minor text variations
- Fuzzy string matching

**How It Works**:
- Calculates minimum edits needed to transform output into expected
- Returns normalized score (0-1, where 1 is perfect match)

**Example Use Cases**:
- Name spelling variations ("Shakespear" vs "Shakespeare")
- Product name matching with typos
- User input validation

**Command**:
```bash
burro run-eval -t levenshtein data.json
```

---

#### 2. Exact Match

**Purpose**: Perfect character-by-character matching.

**Best For**:
- IDs and reference codes
- API keys and tokens
- Formatted data (dates, phone numbers)
- Critical data where precision is required

**How It Works**:
- Binary comparison (pass/fail)
- Case-sensitive by default
- No tolerance for differences

**Example Use Cases**:
- Order ID validation
- ISO country codes
- Product SKUs
- Database primary keys

**Command**:
```bash
burro run-eval -t exact data.json
```

---

#### 3. Case Insensitive Match

**Purpose**: String matching ignoring case differences.

**Best For**:
- Email addresses
- Usernames
- General text where case doesn't matter

**How It Works**:
- Converts both strings to lowercase
- Performs exact comparison

**Example Use Cases**:
- Email validation
- Username matching
- Domain name comparison

**Command**:
```bash
burro run-eval -t case_insensitive data.json
```

---

#### 4. Numeric Difference

**Purpose**: Compare numerical values with configurable tolerance.

**Best For**:
- Price calculations
- Measurements and conversions
- Scientific calculations
- Financial computations

**How It Works**:
- Parses numbers from strings
- Calculates absolute difference
- Compares against tolerance threshold

**Configuration**:
```json
{
  "input": "Calculate 10% tax on $100",
  "output": "10.00",
  "expected": "10",
  "tolerance": 0.01
}
```

**Example Use Cases**:
- Price comparisons with rounding
- Percentage calculations
- Unit conversions
- Statistical measurements

**Command**:
```bash
burro run-eval -t numeric data.json
```

---

#### 5. JSON Diff

**Purpose**: Structural comparison of JSON objects.

**Best For**:
- API response validation
- Data extraction accuracy
- Configuration file comparison
- Structured data parsing

**How It Works**:
- Parses both strings as JSON
- Compares structure and values
- Identifies specific differences

**Example Use Cases**:
- REST API response validation
- Data transformation accuracy
- Configuration file validation
- Structured data extraction

**Command**:
```bash
burro run-eval -t json data.json
```

---

#### 6. Jaccard Similarity

**Purpose**: Calculate similarity between sets of tokens (words).

**Best For**:
- Keyword matching
- Tag similarity
- Topic overlap
- Content comparison (order-independent)

**How It Works**:
- Tokenizes both strings into words
- Calculates intersection/union ratio
- Returns similarity score (0-1)

**Formula**: `Jaccard = |A ∩ B| / |A ∪ B|`

**Example Use Cases**:
- Tag cloud comparison
- Keyword extraction validation
- Topic classification
- Content similarity (when order doesn't matter)

**Command**:
```bash
burro run-eval -t jaccard data.json
```

---

#### 7. Contains

**Purpose**: Verify if expected value appears anywhere in output.

**Best For**:
- Key phrase verification
- Presence checks
- Substring matching
- Flexible validation

**How It Works**:
- Searches for expected string within output
- Case-sensitive search
- Returns boolean result

**Example Use Cases**:
- Check if answer mentions key terms
- Verify required information is present
- Validate that specific phrases appear
- Flexible content validation

**Command**:
```bash
burro run-eval -t contains data.json
```

---

### LLM-as-a-Judge Evaluations

All LLM-based evaluations **require an OpenAI API key** and provide semantic, context-aware assessment.

#### 1. Factuality

**Purpose**: Evaluate answer correctness with context validation.

**Best For**:
- Question answering systems
- Fact-checking outputs
- Knowledge base validation
- Customer support responses

**How It Works**:
- Uses LLM to assess semantic correctness
- Considers context and intent
- Provides detailed reasoning
- Returns confidence score

**Input Format**:
```json
{
  "input": "What is the capital of France?",
  "output": "The capital city of France is Paris",
  "expected": "Paris"
}
```

**Example Use Cases**:
- Chatbot response validation
- Educational content accuracy
- FAQ system testing
- Knowledge graph validation

**Command**:
```bash
burro run-eval -t factuality data.json
```

---

#### 2. Close QA (Close-ended Question Answering)

**Purpose**: Evaluate answers to close-ended questions with specific criteria.

**Best For**:
- Multiple choice questions
- Yes/no questions
- Specific format requirements
- Structured answer validation

**How It Works**:
- Evaluates against specific criteria
- Checks format and content
- Validates answer structure

**Input Format**:
```json
{
  "input": "List the first three prime numbers",
  "output": "2,3,5",
  "criteria": "Numbers must be in correct order, separated by commas"
}
```

**Example Use Cases**:
- Quiz systems
- Structured data validation
- Format compliance checking
- Standardized test grading

**Command**:
```bash
burro run-eval -t closeqa data.json
```

---

#### 3. Battle (Model Comparison)

**Purpose**: Head-to-head comparison of different model outputs.

**Best For**:
- A/B testing models
- Quality comparison
- Model selection
- Performance benchmarking

**How It Works**:
- LLM judges which output is better
- Considers multiple quality factors
- Provides reasoning for decision
- Returns comparative scores

**Input Format**:
```json
{
  "input": "Write a haiku about technology",
  "output": "Code flows like water\nBits and bytes dance in rhythm\nDigital zen speaks",
  "expected": "Silicon pathways\nData streams through endless night\nMachines dream in code"
}
```

**Example Use Cases**:
- Compare GPT-4 vs Claude
- Test different prompts
- Evaluate fine-tuned models
- Quality assessment

**Command**:
```bash
burro run-eval -t battle data.json
```

---

#### 4. Summarization

**Purpose**: Evaluate quality and accuracy of text summaries.

**Best For**:
- Summary generation validation
- Content compression quality
- Key point extraction
- Abstract generation

**How It Works**:
- Compares summary against original context
- Evaluates completeness and accuracy
- Checks for key information retention
- Assesses conciseness

**Input Format**:
```json
{
  "input": "Summarize this article",
  "output": "Brief summary text here",
  "context": "Full original text here..."
}
```

**Evaluation Criteria**:
- Accuracy: Does it reflect the original?
- Completeness: Are key points included?
- Conciseness: Is it appropriately brief?
- Coherence: Is it well-structured?

**Example Use Cases**:
- News article summarization
- Meeting notes generation
- Research paper abstracts
- Document condensation

**Command**:
```bash
burro run-eval -t summarization data.json
```

---

#### 5. SQL

**Purpose**: Verify correctness of generated SQL queries.

**Best For**:
- SQL generation validation
- Query optimization checks
- Syntax verification
- Semantic correctness

**How It Works**:
- Evaluates SQL syntax
- Checks logical correctness
- Compares against expected query
- Validates schema usage

**Input Format**:
```json
{
  "input": "Find all users over age 18",
  "output": "SELECT * FROM users WHERE age > 18;",
  "expected": "SELECT * FROM users WHERE age > 18;",
  "context": "Database schema: users(id, name, email, age)"
}
```

**Evaluation Criteria**:
- Syntax correctness
- Logical equivalence
- Best practices
- Schema compliance

**Example Use Cases**:
- Text-to-SQL systems
- Database query generation
- SQL learning tools
- Query optimization

**Command**:
```bash
burro run-eval -t sql data.json
```

---

#### 6. Translation

**Purpose**: Assess translation quality across languages.

**Best For**:
- Machine translation validation
- Localization testing
- Language quality assessment
- Translation accuracy

**How It Works**:
- Evaluates semantic accuracy
- Checks natural language fluency
- Considers cultural context
- Assesses tone preservation

**Input Format**:
```json
{
  "input": "Translate 'Hello' to Spanish",
  "output": "Hola",
  "expected": "Hola"
}
```

**Evaluation Criteria**:
- Semantic accuracy
- Fluency and naturalness
- Cultural appropriateness
- Tone consistency

**Example Use Cases**:
- Translation system validation
- Localization quality control
- Language learning apps
- Multilingual content verification

**Command**:
```bash
burro run-eval -t translation data.json
```

---

## Security Features

### 1. API Key Management

**Encrypted Storage**:
- AES-256-GCM encryption
- Secure key derivation
- No plaintext storage
- Protected SQLite database

**Key Setup**:
```bash
burro set-openai-key
```

**How It Works**:
1. User enters API key via secure prompt
2. Key is encrypted using AES-256-GCM
3. Encrypted key stored in SQLite database
4. Key is decrypted only when needed
5. Never logged or exposed

### 2. Security Best Practices

- **No Key in Code**: API keys never in source code
- **Environment Isolation**: Separate storage per user
- **Secure Prompts**: Password-style input masking
- **Minimal Permissions**: Only required file access
- **No Network Logging**: API calls not logged

---

## CLI Features

### 1. Command Structure

```bash
burro [command] [options] [arguments]
```

**Main Commands**:
- `set-openai-key`: Configure API key
- `run-eval`: Execute evaluations

### 2. Command Options

**Global Options**:
- `--version`: Show version information
- `--help`: Display help information

**Evaluation Options**:
- `-t, --type <string>`: Evaluation type
- `-p, --print <bool>`: Export results to JSON
- `--progress`: Show progress indicators

### 3. Help System

**Get Help**:
```bash
burro --help              # General help
burro run-eval --help     # Command-specific help
```

**Version Info**:
```bash
burro --version
# Shows: Burro version, Deno version, V8 version, TypeScript version
```

### 4. Error Handling

**Informative Errors**:
- Clear error messages
- Suggestions for fixes
- Stack traces when needed
- Graceful failure handling

**Examples**:
- Invalid file path → File not found error
- Missing API key → Prompt to set key
- Invalid JSON → Parse error with line number
- Network errors → Retry suggestions

---

## Output & Results

### 1. Console Output

**Progress Indicators**:
```bash
burro run-eval -t factuality data.json --progress
```

Output:
```
Starting factuality evaluation...
Processing item 1/10...
Processing item 2/10...
...
Evaluation complete!
```

**Result Display**:
- Score breakdown per item
- Overall statistics
- Pass/fail indicators
- Detailed reasoning (for LLM evals)

### 2. JSON Export

**Export Results**:
```bash
burro run-eval -t battle comparison.json -p
```

**Output Location**: `~/Downloads/<filename>-result.json`

**Format**:
```json
{
  "evaluationType": "battle",
  "totalItems": 5,
  "averageScore": 0.85,
  "results": [
    {
      "input": "...",
      "output": "...",
      "expected": "...",
      "score": 0.9,
      "reasoning": "..."
    }
  ]
}
```

### 3. Result Interpretation

**Heuristic Scores**:
- 1.0: Perfect match
- 0.8-0.99: High similarity
- 0.6-0.79: Moderate similarity
- 0.4-0.59: Low similarity
- <0.4: Poor match

**LLM Scores**:
- Varies by evaluation type
- Often includes reasoning
- May include confidence levels
- Can provide suggestions

---

## Advanced Features

### 1. Batch Evaluation

Run multiple evaluations sequentially:

```bash
#!/bin/bash
# evaluate-all.sh

burro run-eval -t exact tests/critical.json
burro run-eval -t factuality tests/qa.json
burro run-eval -t sql tests/queries.json
burro run-eval -t battle tests/comparison.json
```

### 2. CI/CD Integration

**Example GitHub Action**:
```yaml
name: LLM Evaluation
on: [push]
jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Burro
        run: |
          curl -L "https://github.com/thisguymartin/burro/releases/download/latest/build-linux-intel" -o burro
          chmod +x burro
      - name: Run Evaluations
        run: |
          ./burro run-eval -t exact tests/ids.json
          ./burro run-eval -t factuality tests/qa.json
```

### 3. Custom Workflows

**Multi-Stage Pipeline**:
```bash
# Stage 1: Critical exact matches
burro run-eval -t exact tests/critical.json

# Stage 2: Semantic validation
burro run-eval -t factuality tests/qa.json --progress

# Stage 3: Quality comparison
burro run-eval -t battle tests/models.json -p

# Stage 4: Analysis
cat ~/Downloads/models.json-result.json | jq '.averageScore'
```

### 4. Result Analysis

**Using jq for Analysis**:
```bash
# Get average score
burro run-eval -t levenshtein data.json -p
jq '.averageScore' ~/Downloads/data.json-result.json

# Find failing tests
jq '.results[] | select(.score < 0.5)' ~/Downloads/data.json-result.json

# Count passes
jq '.results | map(select(.score >= 0.8)) | length' ~/Downloads/data.json-result.json
```

---

## Platform Support

### 1. Supported Platforms

| Platform | Architecture | Build Target |
|----------|-------------|--------------|
| macOS | Apple Silicon (M1/M2/M3) | `aarch64-apple-darwin` |
| macOS | Intel x86_64 | `x86_64-apple-darwin` |
| Linux | ARM64 | `aarch64-unknown-linux-gnu` |
| Linux | x86_64 | `x86_64-unknown-linux-gnu` |
| Windows | x86_64 | `x86_64-pc-windows-msvc` |

### 2. System Requirements

**Minimum Requirements**:
- No runtime dependencies (single binary)
- 50MB disk space
- Internet connection (for LLM evals only)

**Recommended**:
- 100MB disk space for results
- Unix-like shell (for scripts)
- JSON parser (jq) for advanced analysis

### 3. Installation Methods

**Unix Systems (macOS/Linux)**:
```bash
# Direct installation to /usr/local/bin
sudo curl -L "<release-url>" -o /usr/local/bin/burro
sudo chmod +x /usr/local/bin/burro
```

**Windows**:
1. Download from releases
2. Rename to `burro.exe`
3. Move to desired location
4. Add to PATH (optional)

**Verification**:
```bash
burro --version
which burro  # Unix only
```

---

## Performance Characteristics

### 1. Execution Speed

**Heuristic Evaluations**:
- Near-instant results
- Linear scaling with dataset size
- No network dependency
- Typical: 1000 items in <1 second

**LLM Evaluations**:
- Depends on OpenAI API latency
- Typically 1-3 seconds per item
- Progress indicators recommended for large datasets
- Can process batches efficiently

### 2. Resource Usage

**Memory**:
- Minimal baseline: ~10MB
- Scales with file size
- Efficient JSON parsing
- Stream processing for large files

**Network**:
- Only for LLM evaluations
- Direct HTTPS to OpenAI
- Secure TLS 1.3 connection
- Retry logic for failures

---

## Best Practices

### 1. Choosing Evaluation Methods

**Decision Tree**:
1. Is data exact? → Use `exact`
2. Are numbers involved? → Use `numeric`
3. Is structure important? → Use `json`
4. Need semantic understanding? → Use LLM eval
5. Comparing models? → Use `battle`
6. Want fuzzy matching? → Use `levenshtein`

### 2. Test Data Organization

```
evaluations/
├── critical/         # Exact matches only
├── semantic/         # LLM-based evals
├── heuristic/        # Fast heuristic checks
└── regression/       # Historical test cases
```

### 3. Performance Optimization

- Start with heuristics (faster, free)
- Use LLM evals for ambiguous cases
- Export results for offline analysis
- Batch similar evaluation types
- Use progress indicators for long runs

### 4. Quality Assurance

- Version control evaluation files
- Document expected behaviors
- Regular test case updates
- Cross-validate with multiple methods
- Review LLM reasoning outputs

---

## Troubleshooting

### Common Issues

**1. "Command not found"**
```bash
# Solution: Check installation and PATH
which burro
echo $PATH
```

**2. "API key not found"**
```bash
# Solution: Set API key
burro set-openai-key
```

**3. "Invalid JSON format"**
```bash
# Solution: Validate JSON
cat data.json | jq .
```

**4. "Low scores on factuality tests"**
- Make expected answers less specific
- Include key information only
- Consider multiple evaluation methods

---

## Future Roadmap

Planned features and improvements:

- **Additional Evaluation Types**
  - ROUGE scores for summarization
  - BLEU scores for translation
  - Custom heuristic functions

- **Enhanced Output**
  - HTML report generation
  - Dashboard visualization
  - Comparative analytics

- **Integration Features**
  - Webhook notifications
  - Database export
  - Cloud storage integration

- **Performance**
  - Parallel evaluation processing
  - Caching for repeated evaluations
  - Streaming for large datasets

---

## Contributing

Burro is open source and welcomes contributions:

- Feature requests
- Bug reports
- Documentation improvements
- New evaluation methods
- Test case examples

Visit the [GitHub repository](https://github.com/thisguymartin/burro) to contribute!

---

**Last Updated**: 2025-11-07
**Version**: 1.0.0
