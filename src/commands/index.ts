import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { SetNewOpenAIKey } from "./initialize.ts";
import { RunEval } from "./run-eval.ts";

export function registerCommands(program: Command): void {
  program
    .default("run-eval")
    .command("set-openai-key", SetNewOpenAIKey)
    .command("run-eval ", RunEval);
}
