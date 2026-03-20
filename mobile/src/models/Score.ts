// Model Score - tuong ung voi bang Scores
export interface Score {
  id?: number; // PRIMARY KEY AUTOINCREMENT
  codeStudent: string; // Foreign key -> Students.code
  subject: string;
  score: number;
}

// View model cho hien thi diem (JOIN Students va Scores)
export interface ScoreView {
  name: string; // Ten sinh vien
  subject: string; // Mon hoc
  score: number; // Diem
}
