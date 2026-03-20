/**
 * Entity Student
 * Tuong duong @Entity(tableName = "Students") trong Room
 */

// @Entity(tableName = "Students")
export class Student {
  // @PrimaryKey @NonNull
  code: string;
  name: string;
  className: string;

  constructor(code: string, name: string, className: string) {
    this.code = code;
    this.name = name;
    this.className = className;
  }
}
