import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../utils/logger/logger.service';
import { PasswordHandler } from '@/utils/password-handler/password-handler.service';
import { ISessionsRepository } from '@/repositories/interfaces/sessions.repository.interface';
import { addOneHour } from '@/helpers/add-one-hour';

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

  async signIn(email: string, pass: string): Promise<{ accessToken: string }> {
    this.logger.info('Attempting sign in', { email });

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn('Sign in failed - user not found', { email });
      throw new UnauthorizedException();
    }

    this.logger.info('User found, checking password', { userId: user.id, hasPassword: !!user.password });

    if (!user.password) {
      this.logger.error('Password is missing', { userId: user.id });
      throw new UnauthorizedException('Missing loggin information.');
    }

    const comparePassword = await this.passwordHandler.comparePassword(pass, user.password)

    if (!comparePassword) {
      this.logger.warn('Sign in failed - invalid password', { email });
      throw new UnauthorizedException();
    }

    delete user.password
    const payload = { sub: user.id, user }

    this.logger.info('Generating JWT token', { userId: user.id });

    let accessToken: string

    this.logger.info('Creating session', { userId: user.id });

    const session = await this.sessionRepository.findByUserId(user.id)

    if (!session || session.isExpired) {
      this.logger.info('No valid session found, creating new token and session', { userId: user.id });
      accessToken = await this.jwtService.signAsync(payload)
      await this.sessionRepository.create({
        accessToken,
        userId: user.id,
        expiredAt: addOneHour(new Date())
      })
    } else {
      this.logger.info('Getting existing session token', { userId: user.id });
      accessToken = session.accessToken
    }


    this.logger.info('Sign in successful', { userId: user.id });
    this.logger.info(`Authentication successful for user: ${user.id}`);
    return {
      accessToken
    };
  }

  async signOut(accessToken: string) {
    if (!accessToken) throw new UnauthorizedException('Missing token.')

    const session = await this.sessionRepository.findByAccessToken(accessToken);
    const currentDate = new Date()

    if (!session || session.isExpired || currentDate >= session.expiredAt) {
      throw new UnauthorizedException('Must be logged in to sign out.')
    }

    this.logger.info(`User: ${session.userId} attempting sign out.`);

    try {
      this.logger.info(`Starting signing out.`);
      await this.sessionRepository.update(session.userId, session.accessToken, {
        isExpired: true,
        expiredAt: new Date()
      })
      this.logger.info(`Finished signing out.`);
      return true
    } catch (error) {
      this.logger.error(`Error signing out.`, error);
      throw new InternalServerErrorException('Failed to sign out user')
    }
  }
}
