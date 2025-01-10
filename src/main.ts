import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { registerCommands } from "./commands/index.ts";
import { DatabaseService } from "./services/database.ts";
import { info } from "./utils/color.ts";
import { burroTitle } from "./utils/logo.ts";

const program = new Command()
  .name("Burro 🫏🌯")
  .version("1.0.0")
  .description("AI powered burrito LLM evaluation CLI tool")
  .action(() => {
    const db = new DatabaseService();
    const initialRun = db.isInitialRun();

    if (initialRun) {
      console.log(info(burroTitle));
    }
  });

registerCommands(program);

await program.parse(Deno.args);
