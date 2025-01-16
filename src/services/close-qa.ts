import { ClosedQA } from "autoevals";
import { Evaluate } from "./evaluate.ts";

export interface QAEvalItem {
  input: string;
  output: string;
  criteria: string;
}

export interface QAEvalResult {
  name: string;
  score: number;
  metetadata: Record<string, unknown>;
}

export class CloseCaseQA extends Evaluate {
  async evaluateItems(items: QAEvalItem[]): Promise<QAEvalResult[]> {
    const results: QAEvalResult[] = [];
    for await (const item of items) {
      const result = await ClosedQA({
        input: item.input,
        criteria: item.criteria,
        item: item.output,
      });
      results.push(result as QAEvalResult);
    }

    return results;
  }
}
