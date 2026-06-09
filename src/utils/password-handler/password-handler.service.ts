import * as bcryptjs from 'bcryptjs';

export class PasswordHandler {
  async hashPassword(password: string, salt: number = 6): Promise<string> {
    return await bcryptjs.hash(password, salt);
  }

  async comparePassword(
    password: string,
    passwordToCompare: string,
  ): Promise<boolean> {

    return await bcryptjs.compare(password, passwordToCompare);
  }

  decodePassword(encodedPassword: string): string {
    return Buffer.from(encodedPassword, 'base64').toString('utf-8');
  }
}
