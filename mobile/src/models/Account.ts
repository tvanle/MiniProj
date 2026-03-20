// Model Account - tuong ung voi bang Accounts
export interface Account {
  username: string; // PRIMARY KEY
  password: string;
  role: string; // 'admin' | 'student'
}
