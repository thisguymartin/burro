import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

export class DatabaseService {
  private db: DB;
  private static instance: DatabaseService;

  constructor() {
    this.db = new DB("db/settings.db");
    this.initialize();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initialize(): void {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        encrypted_openai_key TEXT,
        encryption_key TEXT,
        init_vector TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name)
      )
    `);
  }

  public setOpenAIKey(value: string, name: string): void {
    this.db.query(
      `INSERT INTO settings (name, encrypted_openai_key, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(name) DO UPDATE SET 
       encrypted_openai_key = excluded.encrypted_openai_key,
       updated_at = CURRENT_TIMESTAMP`,
      [name, value],
    );
  }

  public getOpenAIKey(name: string): string | null {
    const result = this.db.query<[string]>(
      "SELECT encrypted_openai_key FROM settings WHERE name = ?",
      [name],
    );
    return result[0]?.[0] ?? null;
  }

  public setEncryptionKey(value: string, name: string): void {
    this.db.query(
      `INSERT INTO settings (name, encryption_key, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(name) DO UPDATE SET 
       encryption_key = excluded.encryption_key,
       updated_at = CURRENT_TIMESTAMP`,
      [name, value],
    );
  }

  public getEncryptionKey(name: string): string | null {
    const result = this.db.query<[string]>(
      "SELECT encryption_key FROM settings WHERE name = ?",
      [name],
    );
    return result[0]?.[0] ?? null;
  }

  public setInitVector(value: string, name: string): void {
    this.db.query(
      `INSERT INTO settings (name, init_vector, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(name) DO UPDATE SET 
       init_vector = excluded.init_vector,
       updated_at = CURRENT_TIMESTAMP`,
      [name, value],
    );
  }

  public getInitVector(name: string): string | null {
    const result = this.db.query<[string]>(
      "SELECT init_vector FROM settings WHERE name = ?",
      [name],
    );
    return result[0]?.[0] ?? null;
  }

  public getAllSettings(): Array<{ name: string; updated_at: string }> {
    const result = this.db.query<[string, string]>(
      "SELECT name, updated_at FROM settings ORDER BY updated_at DESC",
    );
    return result.map(([name, updated_at]) => ({ name, updated_at }));
  }

  public deleteSettings(name: string): void {
    this.db.query("DELETE FROM settings WHERE name = ?", [name]);
  }

  public close(): void {
    this.db.close();
  }
}
