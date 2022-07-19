
export class UserDto {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  resetCode: string;
  emailVerified: boolean;
  enabled: boolean;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.username = obj.username;
    this.password = obj.password;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.email = obj.email;
    this.resetCode = obj.resetCode;
    this.emailVerified = obj.emailVerified;
    this.enabled = obj.enabled;
  }
}
