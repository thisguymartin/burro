import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import chalk from "chalk";

export default new Command()
  .name("greet")
  .description("Greet someone")
  .option("-n, --name <name:string>", "Name to greet")
  .action((options) => {
    console.log(chalk.green(`Hello, ${options.name || "World"}!`));
  });
