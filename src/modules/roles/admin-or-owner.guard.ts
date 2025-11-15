import { Role } from '@/types/roles';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const userId = user?.sub || user?.user?.id;
    const userRoles: Role[] = user?.user?.roles || user?.roles || [];
    console.log(userRoles)
    if (userRoles.includes('ADMIN')) {
      return true;
    }

    if (!userId) {
      throw new ForbiddenException('User ID not found');
    }

    request.userId = userId;
    return true;
  }
}

