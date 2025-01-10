// deno-lint-ignore-file
import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import {
  Confirm,
  Input,
  Number,
  Secret,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import * as mod from "node:crypto";
import { DatabaseService } from "../services/database.ts";
import { error } from "../utils/color.ts";
import {
  decrypt,
  encrypt,
  generateEncryptionKey,
  generateInitalizeVector,
} from "../utils/encryption.ts";

export const SetNewOpenAIKey = new Command()
  .name("set-openai-key")
  .description("OPENAI_KEY is Required")
  .action(async () => {
    const db = new DatabaseService();
    const OPENAIKEY = await Secret.prompt({
      message: "Enter your OPENAI key",
    });

    if (!OPENAIKEY) {
      console.log(error("Please enter a valid key"));
      return;
    }

    const setup = db.getInitailSetup();
    if (!setup) {
      console.log(error("Failed to get initial setup"));
      return;
    }
    const [_id, _name, key, encryptionKey, secret, createdDate] = setup;

    console.log({ OPENAIKEY, key });

    const encrypkey = await generateEncryptionKey();
    const randomKey = generateInitalizeVector();
    const encrypted = await encrypt(OPENAIKEY, encrypkey, randomKey);
    console.log({ encrypted });

    const decrypted = await decrypt(encrypted, encrypkey, randomKey);
    console.log({ decrypted });

    // save the key to the database using db.setOpenAiKey(encrypted);
    // db.setOpenAiKey(encrypted);
  });
