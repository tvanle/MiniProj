/**
 * DBHelper - SQLite Database Helper
 * Tuong duong voi SQLiteOpenHelper trong Android
 *
 * Quan ly database StudentDB voi 3 bang:
 * - Accounts (username, password, role)
 * - Students (code, name, className)
 * - Scores (id, codeStudent, subject, score)
 *
 * Luu y: Web khong ho tro expo-sqlite, dung in-memory storage thay the
 */

import { Platform } from 'react-native';
import type { Account } from '../models/Account';
import type { Student } from '../models/Student';
import type { Score, ScoreView } from '../models/Score';

const DB_NAME = 'StudentDB';

// In-memory storage cho Web (vi expo-sqlite khong ho tro web)
const memoryDB = {
  accounts: [] as Account[],
  students: [] as Student[],
  scores: [] as Score[],
  initialized: false,
};

class DBHelper {
  private db: import('expo-sqlite').SQLiteDatabase | null = null;
  private isWeb = Platform.OS === 'web';

  // Mo ket noi database
  async open(): Promise<void> {
    if (this.isWeb) {
      if (!memoryDB.initialized) {
        this.seedMemoryData();
        memoryDB.initialized = true;
      }
      return;
    }

    if (this.db) return;
    const SQLite = await import('expo-sqlite');
    this.db = await SQLite.openDatabaseAsync(DB_NAME);
    await this.onCreate();
  }

  // Seed du lieu cho web (in-memory)
  private seedMemoryData(): void {
    memoryDB.accounts = [
      { username: 'admin', password: '123', role: 'admin' },
    ];
    memoryDB.students = [
      { code: 'B22DCCN588', name: 'To An An', className: 'NHOM1' },
      { code: 'B22DCCN559', name: 'Lai Thi Ha', className: 'NHOM1' },
    ];
    memoryDB.scores = [
      { id: 1, codeStudent: 'B22DCCN588', subject: 'PTUD cho TBDD', score: 8 },
      { id: 2, codeStudent: 'B22DCCN588', subject: 'LTHDT', score: 5 },
      { id: 3, codeStudent: 'B22DCCN559', subject: 'PTUD cho TBDD', score: 4 },
    ];
  }

  // Tao bang va insert du lieu mau (tuong duong onCreate trong Android)
  private async onCreate(): Promise<void> {
    if (!this.db) return;

    // Tao bang Accounts
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS Accounts(
        username TEXT PRIMARY KEY,
        password TEXT,
        role TEXT
      );
    `);

    // Tao bang Students
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS Students(
        code TEXT PRIMARY KEY,
        name TEXT,
        className TEXT
      );
    `);

    // Tao bang Scores
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS Scores(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codeStudent TEXT,
        subject TEXT,
        score REAL
      );
    `);

    // Insert du lieu mau neu chua co
    await this.seedData();
  }

  // Du lieu mau cho native
  private async seedData(): Promise<void> {
    if (!this.db) return;

    const existingAccount = await this.db.getFirstAsync<Account>(
      'SELECT * FROM Accounts WHERE username = ?',
      ['admin']
    );

    if (existingAccount) return;

    await this.db.runAsync('INSERT INTO Accounts VALUES(?, ?, ?)', ['admin', '123', 'admin']);
    await this.db.runAsync('INSERT INTO Students VALUES(?, ?, ?)', ['B22DCCN588', 'To An An', 'NHOM1']);
    await this.db.runAsync('INSERT INTO Students VALUES(?, ?, ?)', ['B22DCCN559', 'Lai Thi Ha', 'NHOM1']);
    await this.db.runAsync('INSERT INTO Scores(codeStudent, subject, score) VALUES(?, ?, ?)', ['B22DCCN588', 'PTUD cho TBDD', 8]);
    await this.db.runAsync('INSERT INTO Scores(codeStudent, subject, score) VALUES(?, ?, ?)', ['B22DCCN588', 'LTHDT', 5]);
    await this.db.runAsync('INSERT INTO Scores(codeStudent, subject, score) VALUES(?, ?, ?)', ['B22DCCN559', 'PTUD cho TBDD', 4]);
  }

  // ============== ACCOUNT OPERATIONS ==============

  async insertAccount(username: string, password: string, role: string): Promise<boolean> {
    try {
      await this.open();
      if (this.isWeb) {
        if (memoryDB.accounts.find(a => a.username === username)) return false;
        memoryDB.accounts.push({ username, password, role });
        return true;
      }
      await this.db!.runAsync('INSERT INTO Accounts VALUES(?, ?, ?)', [username, password, role]);
      return true;
    } catch {
      return false;
    }
  }

  async checkLogin(username: string, password: string): Promise<boolean> {
    await this.open();
    if (this.isWeb) {
      return memoryDB.accounts.some(a => a.username === username && a.password === password);
    }
    const result = await this.db!.getFirstAsync<Account>(
      'SELECT * FROM Accounts WHERE username = ? AND password = ?',
      [username, password]
    );
    return result !== null;
  }

  // ============== STUDENT OPERATIONS ==============

  async insertStudent(code: string, name: string, className: string): Promise<boolean> {
    try {
      await this.open();
      if (this.isWeb) {
        if (memoryDB.students.find(s => s.code === code)) return false;
        memoryDB.students.push({ code, name, className });
        return true;
      }
      await this.db!.runAsync('INSERT INTO Students VALUES(?, ?, ?)', [code, name, className]);
      return true;
    } catch {
      return false;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    await this.open();
    if (this.isWeb) {
      return [...memoryDB.students];
    }
    return await this.db!.getAllAsync<Student>('SELECT * FROM Students');
  }

  // ============== SCORE OPERATIONS ==============

  async insertScore(codeStudent: string, subject: string, score: number): Promise<boolean> {
    try {
      await this.open();
      if (this.isWeb) {
        const id = memoryDB.scores.length + 1;
        memoryDB.scores.push({ id, codeStudent, subject, score });
        return true;
      }
      await this.db!.runAsync(
        'INSERT INTO Scores(codeStudent, subject, score) VALUES(?, ?, ?)',
        [codeStudent, subject, score]
      );
      return true;
    } catch {
      return false;
    }
  }

  // Lay danh sach diem (JOIN Students va Scores)
  async getScores(): Promise<ScoreView[]> {
    await this.open();
    if (this.isWeb) {
      // Simulate JOIN trong memory
      return memoryDB.scores.map(sc => {
        const student = memoryDB.students.find(st => st.code === sc.codeStudent);
        return {
          name: student?.name || 'Unknown',
          subject: sc.subject,
          score: sc.score,
        };
      });
    }
    return await this.db!.getAllAsync<ScoreView>(
      `SELECT st.name, s.subject, s.score
       FROM Scores s
       JOIN Students st ON s.codeStudent = st.code`
    );
  }
}

// Singleton instance
export const dbHelper = new DBHelper();
