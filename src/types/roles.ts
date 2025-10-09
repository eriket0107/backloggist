import { SetMetadata } from '@nestjs/common';

export enum Role {
  user = 'USER',
  admin = 'ADMIN'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);