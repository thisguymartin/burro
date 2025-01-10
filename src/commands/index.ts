import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { SetNewOpenAIKey } from "./initialize.ts";

export function registerCommands(program: Command): void {
  program
    .command("set-openai-key ", SetNewOpenAIKey);
}
