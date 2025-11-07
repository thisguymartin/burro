import { Battle, Summarization, Sql, Translation } from "autoevals";
import { Evaluate } from "./evaluate.ts";

export interface BattleEvalItem {
  input: string;
  output: string;
  expected: string;
}

export interface SummarizationEvalItem {
  input: string;
  output: string;
  context?: string;
}

export interface SqlEvalItem {
  input: string;
  output: string;
  expected: string;
  context?: string;
}

export interface TranslationEvalItem {
  input: string;
  output: string;
  expected: string;
}

export interface LLMJudgeResult {
  name: string;
  score: number;
  metadata: {
    rationale: string;
    choice?: string;
  };
}

export class LLMJudgeEval extends Evaluate {
  // Battle: Compare two model outputs
  async evaluateBattle(items: BattleEvalItem[]): Promise<LLMJudgeResult[]> {
    const results: LLMJudgeResult[] = [];

    for (const item of items) {
      const result = await Battle({
        input: item.input,
        output: item.output,
        expected: item.expected,
      } as any);

      results.push(result as LLMJudgeResult);
    }

    return results;
  }

  // Summarization: Evaluate summary quality
  async evaluateSummarization(
    items: SummarizationEvalItem[],
  ): Promise<LLMJudgeResult[]> {
    const results: LLMJudgeResult[] = [];

    for (const item of items) {
      const result = await Summarization({
        input: item.input,
        output: item.output,
        context: item.context,
      } as any);

      results.push(result as LLMJudgeResult);
    }

    return results;
  }

  // SQL: Validate SQL query correctness
  async evaluateSql(items: SqlEvalItem[]): Promise<LLMJudgeResult[]> {
    const results: LLMJudgeResult[] = [];

    for (const item of items) {
      const result = await Sql({
        input: item.input,
        output: item.output,
        expected: item.expected,
        context: item.context,
      } as any);

      results.push(result as LLMJudgeResult);
    }

    return results;
  }

  // Translation: Assess translation quality
  async evaluateTranslation(
    items: TranslationEvalItem[],
  ): Promise<LLMJudgeResult[]> {
    const results: LLMJudgeResult[] = [];

    for (const item of items) {
      const result = await Translation({
        input: item.input,
        output: item.output,
        expected: item.expected,
      } as any);

      results.push(result as LLMJudgeResult);
    }

    return results;
  }

  static printResults(results: LLMJudgeResult[], type: string): void {
    console.log(`\n${type} Evaluation Results:`);
    console.log("=".repeat(type.length + 22) + "\n");

    results.forEach((result, index) => {
      console.log(`Item ${index + 1}:`);
      console.log(`Name: ${result.name}`);
      console.log(`Score: ${result.score.toFixed(3)}`);
      if (result.metadata.choice) {
        console.log(`Choice: ${result.metadata.choice}`);
      }
      console.log(`Rationale: ${result.metadata.rationale}`);
      console.log("----------------------------\n");
    });

    const avgScore = results.reduce((sum, r) => sum + r.score, 0) /
      results.length;
    console.log(`Average Score: ${avgScore.toFixed(3)}`);
  }
}
