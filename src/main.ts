import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { registerCommands } from "./commands/index.ts";
import { DatabaseService } from "./services/database.ts";
import { info } from "./utils/color.ts";



const program = new Command()
  .name("Burro 🫏🌯")
  .version("1.0.0")
  .description("AI powered burrito LLM evaluation CLI tool")
  .action(() => {
      console.log(info.bold("Welcome to Burro 🫏🌯"))
      const db = new DatabaseService();
      db.createTable()
      console.log(info("Database created successfully"))


      const result = db.connection?.query("SELECT * FROM config WHERE name = 'OPENAI'");
      const openai = result ? result[0] : undefined;
        // create a new instance of the database
        console.log(openai)

      if (!openai?.length) {
        const created = db?.connection?.query("INSERT INTO config (name, key) VALUES (?, ?)", ["OPENAI", "11111111"])

        console.log({created})


      } else {
        console.log(info("OpenAI key already exists"), openai)
      }




  });
  

// Register commands from the commands folder
registerCommands(program);

await program.parse(Deno.args);
