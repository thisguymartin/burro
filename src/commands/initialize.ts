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
  arrayBufferToBase64,
  base64ToArrayBuffer,
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
    const [_id, _name, _dbKey, encryptionKey, secretKey] = setup;

    const encryptionKeyArrayBuffer = base64ToArrayBuffer(
      encryptionKey as string,
    );
    const encryptionSecretArrayBuffer = base64ToArrayBuffer(
      secretKey as string,
    );
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      encryptionKeyArrayBuffer,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );

    const encryptionSecretUniArray = new Uint8Array(
      encryptionSecretArrayBuffer,
    );
    const encrypted = await encrypt(
      OPENAIKEY,
      cryptoKey,
      encryptionSecretUniArray,
    );

    const arrayBufferToBase64Encrypted = arrayBufferToBase64(encrypted);

    const es = base64ToArrayBuffer(arrayBufferToBase64Encrypted);
    const secretOpenAi = new Uint8Array(es);

    // const decrypted = await decrypt(secretOpenAi, key3, iv);
    // console.log({ secretOpenAi, decrypted });

    // save the key to the database using db.setOpenAiKey(encrypted);
    // db.setOpenAiKey(encrypted);
  });
