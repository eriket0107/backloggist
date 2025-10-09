import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { Response as ResponseType } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Response() res: ResponseType) {
    const { accessToken } = await this.authService.signIn(signInDto.email, signInDto.password);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // HTTPS only
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 // 1 DAY
    });

    return res.send('Created')
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  signOut(@Request() req) {
    const user = this.getProfile(req)
    return this.authService.signOut(user.accessToken)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
