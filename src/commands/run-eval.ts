import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { ApiKeyLoader } from "../services/openAi.ts";
import { FactualityEval, FactualityEvalItem } from "../services/faculty.ts";
import { CloseCaseQA, QAEvalItem } from "../services/close-qa.ts";
import { error, success } from "../utils/color.ts";

export const RunEval = new Command()
  .default("run-eval")
  .description("Run the evaluation")
  .option("-t, --type <string>", "Type of evaluation to run")
  .option("-p, --print <bool>", "Print the results")
  .arguments("<file>")
  .action(async ({ type, print }, file: string) => {
    const keyLoader = new ApiKeyLoader();
    await keyLoader.loadApiKey();
    let generalResult: string;
    if (type === "factuality") {
      const faculty = new FactualityEval();
      const items = await faculty.parseFile<FactualityEvalItem[]>(file);
      const results = await faculty.evaluateItems(items);
      console.log(results);
      generalResult = JSON.stringify(results, null, 2);
    } else if (type == "closeqa") {
      const closeQa = new CloseCaseQA();
      const items = await closeQa.parseFile<QAEvalItem[]>(file);
      const result = await closeQa.evaluateItems(items);
      console.log(result);
      generalResult = JSON.stringify(result, null, 2);
    } else {
      console.error(error("Invalid evaluation type"));
      return;
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
  });
