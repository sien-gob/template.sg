import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { open, Database as SQLiteDatabase } from 'sqlite';
import * as fs from 'fs';
import * as path from 'path';
import { getPopulateSettings } from './populate.settings';

@Injectable()
export class Database implements OnModuleDestroy {
  protected readonly logger = new Logger(this.constructor.name);
  private db: Promise<SQLiteDatabase<sqlite3.Database, sqlite3.Statement>>;
  private static instance: Database;
  private readonly dbPath = 'C:/data/db/sg/core/data.db';

  constructor() {
    this.ensureDirectoryExists(this.dbPath);
    this.db = this.createConnection();
  }

  private ensureDirectoryExists(filePath: string) {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      //this.logger.log(`Carpeta creada: ${dirPath}`);
    }
  }

  private async createConnection(): Promise<SQLiteDatabase<sqlite3.Database, sqlite3.Statement>> {
    const db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    });

    await db.exec('PRAGMA journal_mode = WAL;'); // Write-Ahead Logging
    await db.exec('PRAGMA synchronous = NORMAL;');
    //await db.exec('PRAGMA cache_size = 1000;');
    await db.exec('PRAGMA foreign_keys = ON;');

    return db;
  }

  async onModuleDestroy() {
    const db = await this.db;
    await db.close();
    this.logger.log('Cierre conexión sqlite');
  }

  getDataBase() {
    return this.db;
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
          code TEXT,
          source TEXT,
          metadata TEXT,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime'))
        );

         CREATE TABLE IF NOT EXISTS contexts (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          name TEXT NOT NULL UNIQUE,
          description TEXT
        );


        CREATE TABLE IF NOT EXISTS apis (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            name TEXT NOT NULL UNIQUE,
            url TEXT NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS context_apis (
            context_id TEXT NOT NULL,
            api_id TEXT NOT NULL,
            PRIMARY KEY (context_id, api_id),
            FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE,
            FOREIGN KEY (api_id) REFERENCES apis(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS connectiondbs (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            name TEXT NOT NULL UNIQUE,
            server TEXT NOT NULL,
            database TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS context_connectiondb (
            context_id TEXT NOT NULL,
            connectiondb_id TEXT NOT NULL,
            PRIMARY KEY (context_id, connectiondb_id),
            FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE,
            FOREIGN KEY (connectiondb_id) REFERENCES connectiondbs(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS settings (
            id TEXT PRIMARY KEY,  -- Identificador único (por ejemplo, 'config')
            data TEXT NOT NULL    -- Datos de configuración en formato JSON
        );        

        INSERT INTO parameters (code, data, description) 
         VALUES ('SETTING-INIT', '0', 'Especifica la carga inicial de los ajustes')
            ON CONFLICT(code) DO NOTHING;
  
        INSERT INTO contexts (id, type, name, description) 
         VALUES ('GES-001', 'DB', 'SIENGOB', 'Sistema de Gestión Presupuestal')
            ON CONFLICT(id) DO NOTHING;

        INSERT INTO contexts (id, type, name, description) 
         VALUES ('API-001', 'API', 'URL-PROVEEDOR-ACCESSS', 'URL del proveedor servicio de autenticación y autorización')
            ON CONFLICT(id) DO NOTHING;        
    `;

    await db.exec(sqlData);

    const rsSettings = await this.query("SELECT code FROM parameters where code = 'SETTING-INIT' and data = '0'", []);
    if (rsSettings.length > 0) {
      await db.exec(getPopulateSettings());
    }

    this.logger.log('Base de datos inicializada');
  }
}
