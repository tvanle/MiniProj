/**
 * DAO - Data Access Object
 * Tuong duong @Dao interface trong Room
 *
 * Dinh nghia cac method CRUD voi "annotation" comment
 */

import { Platform } from 'react-native';
import { Account } from '../entities/Account';
import { Student } from '../entities/Student';
import { Score } from '../entities/Score';
import { ScoreView } from '../entities/ScoreView';

// In-memory storage cho Web
const memoryDB = {
  accounts: [] as Account[],
  students: [] as Student[],
  scores: [] as Score[],
  autoIncrementId: 0,
};

// @Dao
export class DAO {
  private db: import('expo-sqlite').SQLiteDatabase | null = null;
  private isWeb = Platform.OS === 'web';
  private initialized = false;

  async init(db: import('expo-sqlite').SQLiteDatabase | null): Promise<void> {
    this.db = db;
    if (this.isWeb && !this.initialized) {
      this.seedData();
      this.initialized = true;
      // Expose to window for debugging
      (window as typeof window & { roomDB: typeof memoryDB }).roomDB = memoryDB;
    }
  }

  private seedData(): void {
    // Insert sample data
    memoryDB.accounts.push(new Account('admin', '123', 'admin'));
    memoryDB.students.push(new Student('B22DCCN588', 'To An An', 'NHOM1'));
    memoryDB.students.push(new Student('B22DCCN559', 'Lai Thi Ha', 'NHOM1'));
    memoryDB.scores.push(new Score('B22DCCN588', 'PTUD cho TBDD', 8, ++memoryDB.autoIncrementId));
    memoryDB.scores.push(new Score('B22DCCN588', 'LTHDT', 5, ++memoryDB.autoIncrementId));
    memoryDB.scores.push(new Score('B22DCCN559', 'PTUD cho TBDD', 4, ++memoryDB.autoIncrementId));
  }

  // ================== ACCOUNT ==================

  // @Insert
  async insertAccount(account: Account): Promise<void> {
    if (this.isWeb) {
      memoryDB.accounts.push(account);
      return;
    }
    await this.db!.runAsync(
      'INSERT INTO Accounts VALUES(?, ?, ?)',
      [account.username, account.password, account.role]
    );
  }

  // @Query("SELECT * FROM Accounts WHERE username = :u AND password = :p")
  async login(u: string, p: string): Promise<Account | null> {
    if (this.isWeb) {
      const found = memoryDB.accounts.find(a => a.username === u && a.password === p);
      return found || null;
    }
    return await this.db!.getFirstAsync<Account>(
      'SELECT * FROM Accounts WHERE username = ? AND password = ?',
      [u, p]
    );
  }

  // ================== STUDENT ==================

  // @Insert
  async insertStudent(student: Student): Promise<void> {
    if (this.isWeb) {
      memoryDB.students.push(student);
      return;
    }
    await this.db!.runAsync(
      'INSERT INTO Students VALUES(?, ?, ?)',
      [student.code, student.name, student.className]
    );
  }

  // @Update
  async updateStudent(student: Student): Promise<void> {
    if (this.isWeb) {
      const index = memoryDB.students.findIndex(s => s.code === student.code);
      if (index !== -1) memoryDB.students[index] = student;
      return;
    }
    await this.db!.runAsync(
      'UPDATE Students SET name = ?, className = ? WHERE code = ?',
      [student.name, student.className, student.code]
    );
  }

  // @Delete
  async deleteStudent(student: Student): Promise<void> {
    if (this.isWeb) {
      const index = memoryDB.students.findIndex(s => s.code === student.code);
      if (index !== -1) memoryDB.students.splice(index, 1);
      return;
    }
    await this.db!.runAsync('DELETE FROM Students WHERE code = ?', [student.code]);
  }

  // @Query("SELECT * FROM Students")
  async getAllStudents(): Promise<Student[]> {
    if (this.isWeb) {
      return [...memoryDB.students];
    }
    return await this.db!.getAllAsync<Student>('SELECT * FROM Students');
  }

  // @Query("SELECT * FROM Students WHERE code = :code")
  async getStudentByCode(code: string): Promise<Student | null> {
    if (this.isWeb) {
      return memoryDB.students.find(s => s.code === code) || null;
    }
    return await this.db!.getFirstAsync<Student>(
      'SELECT * FROM Students WHERE code = ?',
      [code]
    );
  }

  // ================== SCORE ==================

  // @Insert
  async insertScore(score: Score): Promise<void> {
    if (this.isWeb) {
      score.id = ++memoryDB.autoIncrementId;
      memoryDB.scores.push(score);
      return;
    }
    await this.db!.runAsync(
      'INSERT INTO Scores(codeStudent, subject, score) VALUES(?, ?, ?)',
      [score.codeStudent, score.subject, score.score]
    );
  }

  // @Query("SELECT st.name, s.subject, s.score FROM Scores s JOIN Students st ON s.codeStudent = st.code")
  async getScores(): Promise<ScoreView[]> {
    if (this.isWeb) {
      return memoryDB.scores.map(sc => {
        const student = memoryDB.students.find(st => st.code === sc.codeStudent);
        return new ScoreView(student?.name || 'Unknown', sc.subject, sc.score);
      });
    }
    const rows = await this.db!.getAllAsync<{ name: string; subject: string; score: number }>(
      `SELECT st.name, s.subject, s.score
       FROM Scores s
       JOIN Students st ON s.codeStudent = st.code`
    );
    return rows.map(r => new ScoreView(r.name, r.subject, r.score));
  }
}
