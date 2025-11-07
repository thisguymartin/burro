import { Evaluate } from "./evaluate.ts";

export interface HeuristicEvalItem {
  input: string;
  output: string;
  expected: string;
  tolerance?: number; // For numeric comparisons
}

export interface HeuristicEvalResult {
  name: string;
  score: number;
  metadata: {
    evaluationType: string;
    details: string;
    matched: boolean;
  };
}

export class HeuristicEval extends Evaluate {
  // Levenshtein distance calculation
  private levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const dp: number[][] = Array(len1 + 1)
      .fill(null)
      .map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + 1,
          );
        }
      }
    }

    return dp[len1][len2];
  }

  // Levenshtein similarity score (normalized)
  evaluateLevenshtein(item: HeuristicEvalItem): HeuristicEvalResult {
    const distance = this.levenshteinDistance(item.output, item.expected);
    const maxLen = Math.max(item.output.length, item.expected.length);
    const score = maxLen === 0 ? 1 : 1 - distance / maxLen;

    return {
      name: "Levenshtein Distance",
      score: Math.max(0, score),
      metadata: {
        evaluationType: "levenshtein",
        details: `Edit distance: ${distance}, Similarity: ${(score * 100).toFixed(2)}%`,
        matched: score > 0.8,
      },
    };
  }

  // Exact match evaluation
  evaluateExactMatch(item: HeuristicEvalItem): HeuristicEvalResult {
    const matched = item.output === item.expected;
    return {
      name: "Exact Match",
      score: matched ? 1 : 0,
      metadata: {
        evaluationType: "exact_match",
        details: matched ? "Exact match found" : "No exact match",
        matched,
      },
    };
  }

  // Case-insensitive exact match
  evaluateCaseInsensitiveMatch(item: HeuristicEvalItem): HeuristicEvalResult {
    const matched = item.output.toLowerCase() === item.expected.toLowerCase();
    return {
      name: "Case Insensitive Match",
      score: matched ? 1 : 0,
      metadata: {
        evaluationType: "case_insensitive",
        details: matched ? "Match found (case-insensitive)" : "No match found",
        matched,
      },
    };
  }

  // Numeric difference evaluation
  evaluateNumericDifference(item: HeuristicEvalItem): HeuristicEvalResult {
    const output = parseFloat(item.output);
    const expected = parseFloat(item.expected);
    const tolerance = item.tolerance || 0.01;

    if (isNaN(output) || isNaN(expected)) {
      return {
        name: "Numeric Difference",
        score: 0,
        metadata: {
          evaluationType: "numeric",
          details: "Invalid numeric values",
          matched: false,
        },
      };
    }

    const difference = Math.abs(output - expected);
    const matched = difference <= tolerance;
    const score = matched ? 1 : Math.max(0, 1 - difference / Math.abs(expected));

    return {
      name: "Numeric Difference",
      score,
      metadata: {
        evaluationType: "numeric",
        details: `Difference: ${difference.toFixed(4)}, Tolerance: ${tolerance}, Within tolerance: ${matched}`,
        matched,
      },
    };
  }

  // JSON diff evaluation
  evaluateJsonDiff(item: HeuristicEvalItem): HeuristicEvalResult {
    try {
      const outputJson = JSON.parse(item.output);
      const expectedJson = JSON.parse(item.expected);

      const differences = this.findJsonDifferences(outputJson, expectedJson);
      const matched = differences.length === 0;
      const score = matched ? 1 : Math.max(0, 1 - differences.length * 0.1);

      return {
        name: "JSON Diff",
        score,
        metadata: {
          evaluationType: "json_diff",
          details: matched
            ? "JSON structures match"
            : `Differences found: ${differences.join(", ")}`,
          matched,
        },
      };
    } catch (error) {
      return {
        name: "JSON Diff",
        score: 0,
        metadata: {
          evaluationType: "json_diff",
          details: `Invalid JSON: ${error}`,
          matched: false,
        },
      };
    }
  }

  private findJsonDifferences(
    obj1: any,
    obj2: any,
    path = "",
  ): string[] {
    const differences: string[] = [];

    if (typeof obj1 !== typeof obj2) {
      differences.push(`${path}: type mismatch`);
      return differences;
    }

    if (obj1 === null || obj2 === null) {
      if (obj1 !== obj2) differences.push(`${path}: null mismatch`);
      return differences;
    }

    if (typeof obj1 !== "object") {
      if (obj1 !== obj2) differences.push(`${path}: value mismatch`);
      return differences;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const allKeys = new Set([...keys1, ...keys2]);
    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;

      if (!(key in obj1)) {
        differences.push(`${newPath}: missing in output`);
      } else if (!(key in obj2)) {
        differences.push(`${newPath}: extra in output`);
      } else {
        differences.push(
          ...this.findJsonDifferences(obj1[key], obj2[key], newPath),
        );
      }
    }

    return differences;
  }

  // Jaccard similarity (for set comparison)
  evaluateJaccard(item: HeuristicEvalItem): HeuristicEvalResult {
    const outputTokens = new Set(item.output.toLowerCase().split(/\s+/));
    const expectedTokens = new Set(item.expected.toLowerCase().split(/\s+/));

    const intersection = new Set(
      [...outputTokens].filter((x) => expectedTokens.has(x)),
    );
    const union = new Set([...outputTokens, ...expectedTokens]);

    const score = union.size === 0 ? 1 : intersection.size / union.size;
    const matched = score > 0.5;

    return {
      name: "Jaccard Similarity",
      score,
      metadata: {
        evaluationType: "jaccard",
        details: `Jaccard index: ${(score * 100).toFixed(2)}%, Intersection: ${intersection.size}, Union: ${union.size}`,
        matched,
      },
    };
  }

  // Contains check
  evaluateContains(item: HeuristicEvalItem): HeuristicEvalResult {
    const matched = item.output.toLowerCase().includes(
      item.expected.toLowerCase(),
    );
    return {
      name: "Contains",
      score: matched ? 1 : 0,
      metadata: {
        evaluationType: "contains",
        details: matched
          ? "Expected value found in output"
          : "Expected value not found in output",
        matched,
      },
    };
  }

  async evaluateItems(
    items: HeuristicEvalItem[],
    type:
      | "levenshtein"
      | "exact"
      | "case_insensitive"
      | "numeric"
      | "json"
      | "jaccard"
      | "contains",
  ): Promise<HeuristicEvalResult[]> {
    const results: HeuristicEvalResult[] = [];

    for (const item of items) {
      let result: HeuristicEvalResult;

      switch (type) {
        case "levenshtein":
          result = this.evaluateLevenshtein(item);
          break;
        case "exact":
          result = this.evaluateExactMatch(item);
          break;
        case "case_insensitive":
          result = this.evaluateCaseInsensitiveMatch(item);
          break;
        case "numeric":
          result = this.evaluateNumericDifference(item);
          break;
        case "json":
          result = this.evaluateJsonDiff(item);
          break;
        case "jaccard":
          result = this.evaluateJaccard(item);
          break;
        case "contains":
          result = this.evaluateContains(item);
          break;
        default:
          throw new Error(`Unknown evaluation type: ${type}`);
      }

      results.push(result);
    }

    return results;
  }

  static printResults(results: HeuristicEvalResult[]): void {
    console.log("\nHeuristic Evaluation Results:");
    console.log("============================\n");

    results.forEach((result, index) => {
      console.log(`Item ${index + 1}:`);
      console.log(`Type: ${result.name}`);
      console.log(`Score: ${result.score.toFixed(3)}`);
      console.log(`Matched: ${result.metadata.matched ? "✓" : "✗"}`);
      console.log(`Details: ${result.metadata.details}`);
      console.log("----------------------------\n");
    });

    const avgScore = results.reduce((sum, r) => sum + r.score, 0) /
      results.length;
    const passedCount = results.filter((r) => r.metadata.matched).length;

    console.log(`Average Score: ${avgScore.toFixed(3)}`);
    console.log(`Passed: ${passedCount}/${results.length}`);
  }
}
