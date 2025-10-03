import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/constants/jwt';
import { RepositoryConfigModule } from '../repository-config/repository-config.module';

@Global()
@Module({
  imports: [UsersModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: jwtConstants.expiresIn },
  }), RepositoryConfigModule],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule { }
