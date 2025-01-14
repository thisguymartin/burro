import {
  base64ToArrayBuffer,
  decrypt,
  deserializeEncryptionData,
} from "../utils/encryption.ts";
import { DatabaseService } from "./database.ts";
import process from "node:process";

interface ApiKeyOptions {
  keyName?: string;
}

export class ApiKeyLoader {
  private db: DatabaseService;

  constructor() {
    this.db = DatabaseService.getInstance();
  }

  async loadApiKey(
    options: ApiKeyOptions = { keyName: "OPENAI" },
  ): Promise<void> {
    const { keyName = "OPENAI" } = options;

    const encryptionKeyBase64 = this.db.getEncryptionKey(keyName);
    const ivBase64 = this.db.getInitVector(keyName);
    const encryptedBase64 = this.db.getOpenAIKey(keyName);

    if (!encryptedBase64 || !encryptionKeyBase64 || !ivBase64) {
      throw new Error(`No encrypted data found for '${keyName}'`);
    }

    const encryptedData = new Uint8Array(
      base64ToArrayBuffer(encryptedBase64),
    );

    const { key, iv } = await deserializeEncryptionData(
      encryptionKeyBase64,
      ivBase64,
    );

    const decrypted = await decrypt(encryptedData, key, iv);
    // Set the decrypted API key as an environment variable
    process.env.OPENAI_API_KEY = decrypted;
  }
}
