/**
 * ScoreView - View model cho hien thi diem
 * Tuong duong voi POJO class trong Room (khong phai Entity)
 * Dung de nhan ket qua tu @Query JOIN
 */

export class ScoreView {
  name: string;
  subject: string;
  score: number;

  constructor(name: string, subject: string, score: number) {
    this.name = name;
    this.subject = subject;
    this.score = score;
  }
}
