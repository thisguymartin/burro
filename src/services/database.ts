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
        const db = new DB("db/burro.db")


        this.connection = db
      }
      return this.connection;
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
          `)

          this.connection?.execute(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_config_name ON config(name);
            `)
    }
  
    async closeConnection() {
      if (this.connection) {
        await this.connection.close();
        this.connection = undefined;
      }
    }
  }