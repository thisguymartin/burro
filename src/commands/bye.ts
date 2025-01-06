import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import chalk from "chalk";

export default new Command()
  .name("bye")
  .description("Say goodbye to someone")
  .arguments("[name:string]")
  .action((name) => {
    console.log(chalk.blue(`Goodbye, ${name}!`));
  });
