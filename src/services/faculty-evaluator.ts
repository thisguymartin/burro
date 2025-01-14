import { Factuality } from "autoevals";

interface EvalItem {
  input: string;
  output: string;
  expected: string;
}

interface FactualityResult {
  score: number;
  metadata: Record<string, unknown>;
}

interface EvalResult extends EvalItem {
  score: number;
  metadata: Record<string, unknown>;
}

export class FactualityEvaluator {
  constructor() {
  }

  async evaluateFromJson(jsonPath: string): Promise<EvalResult[]> {
    try {
      const jsonContent = await Deno.readTextFile(jsonPath);
      const evalItems: EvalItem[] = JSON.parse(jsonContent);
      return await this.evaluateItems(evalItems);
    } catch (error) {
      console.error(`Failed to evaluate from JSON: ${error}`);
      throw new Error(`Failed to evaluate from JSON`);
    }
  }

  private async evaluateItems(items: EvalItem[]): Promise<EvalResult[]> {
    const results: EvalResult[] = [];

    for await (const item of items) {
      const result = await Factuality({
        input: item.input,
        output: item.output,
        expected: item.expected,
      });

      results.push({
        ...item,
        score: result.score,
        metadata: result,
      });
    }

    return results;
  }

  async evaluateSingle(item: EvalItem): Promise<EvalResult> {
    const result = await Factuality({
      input: item.input,
      output: item.output,
      expected: item.expected,
    });

    return {
      ...item,
      score: result.score,
      metadata: result,
    };
  }

  // Helper to print results
  static printResults(results: EvalResult[]): void {
    console.log("\nFactuality Evaluation Results:");
    console.log("=============================\n");

    results.forEach((result, index) => {
      console.log(`Item ${index + 1}:`);
      console.log(`Input: ${result.input}`);
      console.log(`Output: ${result.output}`);
      console.log(`Expected: ${result.expected}`);
      console.log(`Score: ${result.score}`);
      console.log(`Metadata: ${JSON.stringify(result.metadata, null, 2)}`);
      console.log("-----------------------------\n");
    });

    // Print summary statistics
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) /
      results.length;
    console.log(`Average Score: ${avgScore.toFixed(3)}`);
  }
}
