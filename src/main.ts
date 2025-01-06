import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { registerCommands } from "./commands/index.ts";

const program = new Command()
  .name("Burro 🫏🌯")
  .version("1.0.0")
  .description("A simple CLI example");

// Register commands from the commands folder
registerCommands(program);

await program.parse(Deno.args);
