
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../utils/logger/logger.service';
import { PasswordHandler } from '@/utils/password-handler/password-handler.service';

@Injectable()
export class AuthService {
  private logger;

  constructor(
    private usersService: UsersService,
    private passwordHandler: PasswordHandler,
    private jwtService: JwtService,
    private loggerService: LoggerService
  ) {
    this.logger = this.loggerService.createEntityLogger('Auth')
  }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    const comparePassword = this.passwordHandler.comparePassword(user?.password, pass)

    if (!comparePassword) {
      this.logger.warn('Unauthorized.')
      throw new UnauthorizedException();
    }
    delete user.password

    const payload = { sub: user.id, user }

    delete user.id

    const jwt = await this.jwtService.signAsync(payload)
    this.logger.info(`User: ${user.id} | Logged in successfully.`)

    return {
      access_token: jwt
    };
  }

}
