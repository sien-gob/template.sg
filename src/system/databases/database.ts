import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { open, Database as SQLiteDatabase } from 'sqlite';
import * as fs from 'fs';
import * as path from 'path';
import { getPopulateConnections } from './populate.connections';

@Injectable()
export class Database implements OnModuleDestroy {
  protected readonly logger = new Logger(this.constructor.name);
  private db: Promise<SQLiteDatabase<sqlite3.Database, sqlite3.Statement>>;
  private static instance: Database;
  private readonly dbPath = 'C:/data/db/sg/template/data.db';

  constructor() {
    this.ensureDirectoryExists(this.dbPath);
    this.db = this.createConnection();
  }

  private ensureDirectoryExists(filePath: string) {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      this.logger.log(`Carpeta creada: ${dirPath}`);
    }
  }

  private async createConnection(): Promise<SQLiteDatabase<sqlite3.Database, sqlite3.Statement>> {
    const db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    });

    return db;
  }

  async onModuleDestroy() {
    const db = await this.db;
    await db.close();
    this.logger.log('Cierre conexión sqlite');
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    const db = await this.db;
    return db.all(sql, params);
  }

  async run(sql: string, params?: any[]) {
    const db = await this.db;
    return await db.run(sql, params);
  }

  static async staticQuery(sql: string, params?: any[]): Promise<any[]> {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance.query(sql, params);
  }

  async initializeDatabase() {
    const db = await this.db;

    const sqlData = `
        CREATE TABLE IF NOT EXISTS parameters (
          code TEXT PRIMARY KEY,
          data TEXT,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS connections (
          id TEXT PRIMARY KEY,
          name TEXT,
          connection TEXT,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS syslogs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          level TEXT NOT NULL,
          source TEXT,
          metadata TEXT,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime'))
        );
    `;

    await db.exec(sqlData);
    await db.exec(getPopulateConnections());

    this.logger.log('Base de datos inicializada');
  }
}
