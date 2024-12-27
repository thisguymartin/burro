import { Command } from "commander";
import chalk from "chalk";
const program = new Command();

const log = console.log;

program
  .name("Burro 🫏🌯")
  .summary("A simple CLI example")
  .version("1.0.0")
  .description("A simple CLI example")
  .option("-n, --name <name>", "Your name")
  .action((options) => {
    log(chalk.green(`Hello, ${options.name || "World"}!`));
  });

program.parse(Deno.args);
