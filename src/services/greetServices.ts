import chalk from "chalk";

interface GreetOptions {
  name?: string;
}

export class GreetService {
  greet(options: GreetOptions): void {
    console.log(chalk.green(`Hello, ${options.name || "World"}!`));
  }
}

export class ByeService {
  bye(options: GreetOptions): void {
    console.log(chalk.green(`Hello, ${options.name || "World"}!`));
  }
}
