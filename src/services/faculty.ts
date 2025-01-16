import { Factuality } from "autoevals";
import { Evaluate } from "./evaluate.ts";

export interface FactualityEvalItem {
  input: string;
  output: string;
  expected: string;
}

interface FactualityEvalResult  {
  name: string;
  score: number;
  metadata: {
    rationale: string
    choice: string
  }
}

export class FactualityEval extends Evaluate {
  static printResults(results: FactualityEvalResult[]): void {
    console.log("\nFactuality Evaluation Results:");
    console.log("=============================\n");

    results.forEach((result, index) => {
      console.log(`Item ${index + 1}:`);
      console.log(`Output: ${result.name}`);
      console.log(`Score: ${result.score}`);
      console.log(`Metadata: ${JSON.stringify(result.metadata, null, 2)}`);
      console.log("-----------------------------\n");
    });

    // Print summary statistics
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) /
      results.length;
    console.log(`Average Score: ${avgScore.toFixed(3)}`);
  }

  async evaluateItems(
    items: FactualityEvalItem[],
  ): Promise<FactualityEvalResult[]> {
    const results: FactualityEvalResult[] = [];

    for await (const item of items) {
      const result = await Factuality({
        input: item.input,
        output: item.output,
        expected: item.expected,
      } as any);


      results.push(result as FactualityEvalResult);
    }

    return results;
  }
}
