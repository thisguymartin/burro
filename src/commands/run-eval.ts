import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { Factuality } from "autoevals";
import { ApiKeyLoader } from "../services/openAi.ts";

export const RunEval = new Command()
  .default("run-eval")
  .description("Run the evaluation")
  .action(async () => {
    const db = new ApiKeyLoader();
    await db.loadApiKey();

    const input = "Which country has the highest population?";
    const output = "People's Republic of China";
    const expected = "China";

    const result = await Factuality({ output, expected, input });
    console.log(`Factuality score: ${result.score}`);
    console.log(`Factuality metadata: ${JSON.stringify(result, null, 2)}`);
  });
