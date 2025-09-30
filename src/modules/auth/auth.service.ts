import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../utils/logger/logger.service';
import { PasswordHandler } from '@/utils/password-handler/password-handler.service';
import { ISessionsRepository } from '@/repositories/interfaces/sessions.repository.interface';

@Injectable()
export class AuthService {
  private logger;

  constructor(
    @Inject('ISessionsRepository')
    private sessionRepository: ISessionsRepository,
    private usersService: UsersService,
    private passwordHandler: PasswordHandler,
    private jwtService: JwtService,
    private loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.createEntityLogger('Auth')
  }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    this.logger.info('Attempting sign in', { email });

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn('Sign in failed - user not found', { email });
      throw new UnauthorizedException();
    }

    const comparePassword = this.passwordHandler.comparePassword(user.password, pass)
    if (!comparePassword) {
      this.logger.warn('Sign in failed - invalid password', { email });
      throw new UnauthorizedException();
    }

    delete user.password
    const payload = { sub: user.id, user }

    this.logger.info('Generating JWT token', { userId: user.id });
    const jwt = await this.jwtService.signAsync(payload)

    this.logger.info('Creating session', { userId: user.id });
    await this.sessionRepository.create({
      accessToken: jwt,
      userId: user.id,
    })

    this.logger.info('Sign in successful', { userId: user.id });
    return {
      access_token: jwt
    };
  }
}
