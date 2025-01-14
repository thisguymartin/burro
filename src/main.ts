import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { registerCommands } from "./commands/index.ts";
import { DatabaseService } from "./services/database.ts";
import { info, success, warn } from "./utils/color.ts";
import { burroTitle } from "./utils/logo.ts";

const program = new Command()
  .name("Burro 🫏🌯")
  .version("1.0.0")
  .description("AI powered burrito LLM evaluation CLI tool")
  .action(() => {
    const db = DatabaseService.getInstance();
    console.log(db.getAllSettings());
    if (db.getAllSettings().length == 0) {
      console.log(info(burroTitle));
      console.log(
        success(
          "Welcome to Burro, your helpful AI powered burrito LLM evaluation CLI tool.",
        ),
      );
      console.log(
        warn("Please run `burro set-openai-key` to set your OpenAI API key."),
      );
    }
  });

registerCommands(program);

await program.parse(Deno.args);
