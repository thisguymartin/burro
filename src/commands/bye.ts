import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { success } from "../utils/color.ts";

export default new Command()
  .name("bye")
  .description("Say goodbye to someone")
  .arguments("[name:string]")
  .action((name) => {
    console.log(success(`Goodbye, ${name}!`));
  });
