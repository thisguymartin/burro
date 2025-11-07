import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { ApiKeyLoader } from "../services/openAi.ts";
import { FactualityEval, FactualityEvalItem } from "../services/faculty.ts";
import { CloseCaseQA, QAEvalItem } from "../services/close-qa.ts";
import { HeuristicEval, HeuristicEvalItem } from "../services/heuristics.ts";
import {
  BattleEvalItem,
  LLMJudgeEval,
  SqlEvalItem,
  SummarizationEvalItem,
  TranslationEvalItem,
} from "../services/llm-judge.ts";
import { error, info, success } from "../utils/color.ts";

export const RunEval = new Command()
  .default("run-eval")
  .description("Run the evaluation")
  .option("-t, --type <string>", "Type of evaluation to run")
  .option("-p, --print <bool>", "Print the results")
  .option("--progress", "Show progress indicators")
  .arguments("<file>")
  .action(async ({ type, print, progress }, file: string) => {
    const keyLoader = new ApiKeyLoader();

    // Only load API key for LLM-based evaluations
    const llmEvalTypes = ["factuality", "closeqa", "battle", "summarization", "sql", "translation"];
    if (llmEvalTypes.includes(type || "")) {
      await keyLoader.loadApiKey();
    }

    let generalResult: string;
    let results: any;

    try {
      if (progress) {
        console.log(info(`Starting ${type} evaluation...`));
      }

      switch (type) {
        case "factuality": {
          const faculty = new FactualityEval();
          const items = await faculty.parseFile<FactualityEvalItem[]>(file);
          results = await faculty.evaluateItems(items);
          FactualityEval.printResults(results);
          generalResult = JSON.stringify(results, null, 2);
          break;
        }

        case "closeqa": {
          const closeQa = new CloseCaseQA();
          const items = await closeQa.parseFile<QAEvalItem[]>(file);
          results = await closeQa.evaluateItems(items);
          console.log(results);
          generalResult = JSON.stringify(results, null, 2);
          break;
        }

        // Heuristic evaluations
        case "levenshtein":
        case "exact":
        case "case_insensitive":
        case "numeric":
        case "json":
        case "jaccard":
        case "contains": {
          const heuristic = new HeuristicEval();
          const items = await heuristic.parseFile<HeuristicEvalItem[]>(file);
          results = await heuristic.evaluateItems(items, type);
          HeuristicEval.printResults(results);
          generalResult = JSON.stringify(results, null, 2);
          break;
        }

        // LLM-as-Judge evaluations
        case "battle": {
          const judge = new LLMJudgeEval();
          const items = await judge.parseFile<BattleEvalItem[]>(file);
          results = await judge.evaluateBattle(items);
          LLMJudgeEval.printResults(results, "Battle");
          generalResult = JSON.stringify(results, null, 2);
          break;
        }

        case "summarization": {
          const judge = new LLMJudgeEval();
          const items = await judge.parseFile<SummarizationEvalItem[]>(file);
          results = await judge.evaluateSummarization(items);
          LLMJudgeEval.printResults(results, "Summarization");
          generalResult = JSON.stringify(results, null, 2);
          break;
        }

        case "sql": {
          const judge = new LLMJudgeEval();
          const items = await judge.parseFile<SqlEvalItem[]>(file);
          results = await judge.evaluateSql(items);
          LLMJudgeEval.printResults(results, "SQL");
          generalResult = JSON.stringify(results, null, 2);
          break;
        }

        case "translation": {
          const judge = new LLMJudgeEval();
          const items = await judge.parseFile<TranslationEvalItem[]>(file);
          results = await judge.evaluateTranslation(items);
          LLMJudgeEval.printResults(results, "Translation");
          generalResult = JSON.stringify(results, null, 2);
          break;
        }

        default: {
          console.error(error(`Invalid evaluation type: ${type}`));
          console.log(info("\nAvailable evaluation types:"));
          console.log("  LLM-based: factuality, closeqa, battle, summarization, sql, translation");
          console.log("  Heuristic: levenshtein, exact, case_insensitive, numeric, json, jaccard, contains");
          return;
        }
      }

      console.log(success("====================================="));

      if (print) {
        const downloads = Deno.env.get("HOME") + "/Downloads";
        const filename = file.split("/").pop();
        await Deno.writeTextFile(
          `${downloads}/${filename}-result.json`,
          generalResult,
        );

        console.log(
          success(`Results saved to ${downloads}/${filename}-result.json`),
        );
      }
    } catch (err) {
      console.error(error(`Evaluation failed: ${err.message}`));
      if (err.stack) {
        console.error(error(`Stack trace: ${err.stack}`));
      }
      Deno.exit(1);
    }
  });
