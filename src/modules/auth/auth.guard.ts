
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
    private jwtService: JwtService,
    private loggerService: LoggerService,
    @Inject('ISessionsRepository') private sessionService: ISessionsRepository,
  ) {
    this.logger = this.loggerService.createEntityLogger('Auth');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.info('Checking authentication');

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('No token provided in request');
      throw new UnauthorizedException();
    }

    try {
      this.logger.info('Verifying JWT token');
      const payload = this.jwtService.verify(
        token,
        {
          secret: jwtConstants.secret
        }
      );


      this.logger.info(`Authentication successful for user: ${payload.sub}`);
      request['user'] = payload;
    } catch (error) {
      this.logger.warn(`JWT verification failed: ${error.message}`);
      throw new UnauthorizedException();
    }

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
