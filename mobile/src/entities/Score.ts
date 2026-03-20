/**
 * Entity Score
 * Tuong duong @Entity(tableName = "Scores") trong Room
 */

// @Entity(tableName = "Scores")
export class Score {
  // @PrimaryKey(autoGenerate = true)
  id?: number;
  codeStudent: string;
  subject: string;
  score: number;

  constructor(codeStudent: string, subject: string, score: number, id?: number) {
    this.id = id;
    this.codeStudent = codeStudent;
    this.subject = subject;
    this.score = score;
  }
}
