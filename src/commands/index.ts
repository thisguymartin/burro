import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import byeCommand from "./bye.ts";

export function registerCommands(program: Command): void {
  program
    .command("set-openai-key ", byeCommand);
  // .command("greet", greetCommand)
}
