import { Role } from '@/types/roles';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminOrSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const paramId = request.params.id;

    const userId = user?.sub || user?.user?.id;
    const userRoles: Role[] = user?.user?.roles || user?.roles || [];

    if (userRoles.includes('ADMIN')) {
      return true;
    }

    if (userId === paramId) {
      return true;
    }

    throw new ForbiddenException('You can only edit your own profile or must be an admin');
  }
}

