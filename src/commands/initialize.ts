import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { Secret } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { DatabaseService } from "../services/database.ts";
import { error, success } from "../utils/color.ts";
import {
  arrayBufferToBase64,
  deserializeEncryptionData,
  encrypt,
  generateEncryptionKey,
  generateInitalizeVector,
  serializeEncryptionData,
} from "../utils/encryption.ts";

export const SetNewOpenAIKey = new Command()
  .name("set-openai-key")
  .description("OPENAI_KEY is Required")
  .action(async () => {
    try {
      const OPENAI_KEY = await Secret.prompt({
        message: "Enter your OpenAI API key",
      });

      if (!OPENAI_KEY) {
        console.log(error("Please enter a valid key"));
        return;
      }

      const db = DatabaseService.getInstance();

      // Get or create encryption materials
      let encryptionKey = db.getEncryptionKey("OPENAI");
      let initVector = db.getInitVector("OPENAI");

      console.log(encryptionKey, "initVector");

      if (!encryptionKey || !initVector) {
        // Generate encryption key and IV
        const key = await generateEncryptionKey();
        const iv = generateInitalizeVector();
        const { keyBase64, ivBase64 } = await serializeEncryptionData(key, iv);

        // Save encryption key and IV
        db.setEncryptionKey(keyBase64, "OPENAI");
        db.setInitVector(ivBase64, "OPENAI");

        encryptionKey = keyBase64;
        initVector = ivBase64;
      }

      const { key, iv } = await deserializeEncryptionData(
        encryptionKey,
        initVector,
      );

      const encryptedKey = await encrypt(OPENAI_KEY, key, iv);
      db.setOpenAIKey(arrayBufferToBase64(encryptedKey), "OPENAI");

      console.log(success("OpenAI API key has been encrypted and saved"));
    } catch (err) {
      console.log(error(`Failed to set OpenAI key: `), err);
    }
  });
