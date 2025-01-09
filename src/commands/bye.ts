// deno-lint-ignore-file
import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { Input, Number, Secret, Confirm } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import * as mod from "node:crypto";
import { DatabaseService } from "../services/database.ts";
import { error } from "../utils/color.ts";
import { decrypt, encrypt } from "../utils/encryption.ts";


export default new Command()
  .name("set-openai-key")
  .description("OPENAI_KEY is Required")
  .action(async () => {
    const db = new DatabaseService();
    const OPENAIKEY = await Secret.prompt({
      message: "Enter your OPENAI key",
    });

    if(!OPENAIKEY){
      console.log(error("Please enter a valid key"));
      return 
    }

    const setup = db.getInitailSetup();
    if (!setup) {
      console.log(error("Failed to get initial setup"));
      return;
    }
    const [_id, _name, key] = setup;
    const iv = crypto.getRandomValues(new Uint8Array(12));

    
    console.log({OPENAIKEY, key});
    const {encrypted} = await encrypt(OPENAIKEY, "catq1111111111111111111111111111111111111111111111111111111111111111");
    console.log({encrypted});


    const decrypted = decrypt(encrypted, "catq1111111111111111111111111111111111111111111111111111111111111111");
    console.log({decrypted});

  });



