/**
 * AppDB - Room Database Singleton
 * Tuong duong @Database trong Room
 *
 * @Database(entities = {Account.class, Student.class, Score.class}, version = 1)
 * public abstract class AppDB extends RoomDatabase
 */

import { Platform } from 'react-native';
import { DAO } from './DAO';

const DB_NAME = 'StudentDB';

// @Database(entities = {Account.class, Student.class, Score.class}, version = 1)
class AppDB {
  private static INSTANCE: AppDB | null = null;
  private db: import('expo-sqlite').SQLiteDatabase | null = null;
  private _dao: DAO | null = null;
  private isWeb = Platform.OS === 'web';

  private constructor() {}

  // Singleton pattern - tuong duong getInstance trong Room
  static async getInstance(): Promise<AppDB> {
    if (!AppDB.INSTANCE) {
      AppDB.INSTANCE = new AppDB();
      await AppDB.INSTANCE.initialize();
    }
    return AppDB.INSTANCE;
  }

  private async initialize(): Promise<void> {
    if (!this.isWeb) {
      const SQLite = await import('expo-sqlite');
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
      await this.seedData();
    }

    this._dao = new DAO();
    await this._dao.init(this.db);
  }

  // Tao bang - tuong duong onCreate trong Room
  private async createTables(): Promise<void> {
    if (!this.db) return;

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS Accounts(
        username TEXT PRIMARY KEY,
        password TEXT,
        role TEXT
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS Students(
        code TEXT PRIMARY KEY,
        name TEXT,
        className TEXT
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS Scores(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codeStudent TEXT,
        subject TEXT,
        score REAL
      );
    `);
  }

  // Seed du lieu mau cho native
  private async seedData(): Promise<void> {
    if (!this.db) return;

    const existing = await this.db.getFirstAsync<{ username: string }>(
      'SELECT username FROM Accounts WHERE username = ?',
      ['admin']
    );

    if (existing) return;

    await this.db.runAsync('INSERT INTO Accounts VALUES(?, ?, ?)', ['admin', '123', 'admin']);
    await this.db.runAsync('INSERT INTO Students VALUES(?, ?, ?)', ['B22DCCN588', 'To An An', 'NHOM1']);
    await this.db.runAsync('INSERT INTO Students VALUES(?, ?, ?)', ['B22DCCN559', 'Lai Thi Ha', 'NHOM1']);
    await this.db.runAsync('INSERT INTO Scores(codeStudent, subject, score) VALUES(?, ?, ?)', ['B22DCCN588', 'PTUD cho TBDD', 8]);
    await this.db.runAsync('INSERT INTO Scores(codeStudent, subject, score) VALUES(?, ?, ?)', ['B22DCCN588', 'LTHDT', 5]);
    await this.db.runAsync('INSERT INTO Scores(codeStudent, subject, score) VALUES(?, ?, ?)', ['B22DCCN559', 'PTUD cho TBDD', 4]);
  }

  // public abstract DAO dao();
  dao(): DAO {
    if (!this._dao) {
      throw new Error('Database not initialized. Call getInstance() first.');
    }
    return this._dao;
  }
}

export { AppDB };
