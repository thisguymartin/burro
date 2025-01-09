import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

export class DatabaseService {
  connection: DB | undefined;
  constructor() {
    //   this.config = config;
    //   this.cache = new Map();
  }

  getConnection() {
    // Example using mysql2
    if (!this.connection) {
      const db = new DB("db/burro.db");

      this.connection = db;
    }
    return this.connection;
  }

  getOpenAiKey(){
    this.getConnection();
    const openAiRecord = this.connection?.query("SELECT * FROM config WHERE name = 'OPENAI'")
    const record = openAiRecord ? openAiRecord[0] : undefined;
    return record;
  }

  setOpenAiKey(key: string){
    this.getConnection();
      this.connection?.query("INSERT INTO config (name, key) VALUES (?, ?)", [
        "OPENAI",
        key,
      ])

      console.log("OpenAI key set")
  }

  getInitailSetup(){
    this.getConnection();
    const setupRecord = this.connection?.query(
      "SELECT * FROM config WHERE name = 'INITIAL_SETUP'",
    );
    const record = setupRecord ? setupRecord[0] : undefined;
    return record;
  }

  isInitialRun() {
    this.getConnection();
    this.createTable();
    const setupRecord = this.connection?.query(
      "SELECT * FROM config WHERE name = 'INITIAL_SETUP'",
    );
    const record = setupRecord ? setupRecord[0] : undefined;

    if (!record?.length) {
      const rn = Math.floor(Date.now() * Math.random()).toString();
      this.connection?.query("INSERT INTO config (name, key) VALUES (?, ?)", [
        "INITIAL_SETUP",
        rn,
      ]);
      return true;
    }

    return false;
  }

  createTable() {
    if (this.connection === undefined) {
      this.getConnection();
    }
    this.connection?.execute(`
            CREATE TABLE IF NOT EXISTS config (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              key TEXT
            );
          `);

    this.connection?.execute(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_config_name ON config(name);
            `);
  }

  async closeConnection() {
    if (this.connection) {
      await this.connection.close();
      this.connection = undefined;
    }
  }
}
