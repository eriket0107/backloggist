import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const auth = request.headers.authorization;

    if (!auth || !auth.startsWith('Basic ')) {
      // Set WWW-Authenticate header to trigger browser login prompt
      response.setHeader('WWW-Authenticate', 'Basic realm="Log Access"');
      throw new UnauthorizedException('Authentication required.');
    }

    const credentials = Buffer.from(auth.slice(6), 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Use environment variables for credentials  
    const validUsername = process.env.LOG_USERNAME || 'admin';
    const validPassword = process.env.LOG_PASSWORD || 'secure123';

    if (username !== validUsername || password !== validPassword) {
      // Set WWW-Authenticate header for invalid credentials too
      response.setHeader('WWW-Authenticate', 'Basic realm="Log Access"');
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }
}
