/**
 * Entity Account
 * Tuong duong @Entity(tableName = "Accounts") trong Room
 */

// @Entity(tableName = "Accounts")
export class Account {
  // @PrimaryKey @NonNull
  username: string;
  password: string;
  role: string;

  constructor(username: string, password: string, role: string) {
    this.username = username;
    this.password = password;
    this.role = role;
  }
}
