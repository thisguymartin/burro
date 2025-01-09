import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { success } from "../utils/color.ts";
import {
  cursorTo,
  eraseDown,
  image,
  link,
} from "https://deno.land/x/cliffy@v0.25.5/ansi/ansi_escapes.ts";
import { Table } from "https://deno.land/x/cliffy@v0.25.5/table/mod.ts";

export default new Command()
  .name("greet")
  .description("Greet someone")
  .option("-n, --name <name:string>", "Name to greet")
  .action(async (options) => {
    const table: Table = Table.from([
      ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
      ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
      ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
    ]);

    table.push(["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"]);
    table.sort();
    table.render();

    console.log(success(`Hello, ${options.name || "World"}!`));
    console.log(success(`Hello, ${options.name || "World"}!`));
    console.log(success(`Hello, ${options.name || "World"}!`));
    console.log(success(`Hello, ${options.name || "World"}!`));
  });
