
import { jwtConstants } from '@/constants/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../utils/logger/logger.service';
import { Request } from 'express';
import { ISessionsRepository } from '@/repositories/interfaces/sessions.repository.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger;

  constructor(
    @Inject('ISessionsRepository') private sessionService: ISessionsRepository,
    private jwtService: JwtService,
    private loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.createEntityLogger('Auth');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.info('Checking authentication');

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    const currentDate = new Date()


    if (!accessToken) {
      this.logger.warn('No token provided in request');
      throw new UnauthorizedException();
    }

    this.logger.info('Verifying JWT token');
    let payload

    try {
      payload = this.jwtService.verify(
        accessToken,
        {
          secret: jwtConstants.secret
        }
      );
    } catch {
      this.logger.warn('Session has expired by time, marking as expired.');
      await this.sessionService.expireToken(accessToken)
      throw new UnauthorizedException('Session has expired.');
    }

    const session = await this.sessionService.findByUserId(payload.sub)
    const isExpired: boolean = currentDate >= session.expiredAt

    if (session.isExpired || isExpired) {
      this.logger.warn('Session was already marked as expired.');
      await this.sessionService.expireToken(accessToken)
      throw new UnauthorizedException('Session has expired.');
    }

    request.user = { ...payload, accessToken };

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    this.logger.info('Extracting token from request headers');
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      this.logger.warn(`Invalid authorization type: ${type}`);
    }

    return type === 'Bearer' ? token : undefined;
  }
}
