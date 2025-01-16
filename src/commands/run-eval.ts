import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { ApiKeyLoader } from "../services/openAi.ts";
import { FactualityEvaluator } from "../services/faculty-evaluator.ts";

export const RunEval = new Command()
  .default("run-eval")
  .description("Run the evaluation")
  .arguments("<file>")
  .action(async (_, file: string) => {
    console.log(`Running evaluation from directory: ${JSON.stringify(file)}`);
    const keyLoader = new ApiKeyLoader();
    await keyLoader.loadApiKey();
    const v = new FactualityEvaluator();
    const a = await v.evaluateFromJson(file);
    console.log(a);
  });
