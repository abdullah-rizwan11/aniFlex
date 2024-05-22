import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      const token = await this.authService.signUp(signUpDto);
      return token;
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const token = this.authService.login(loginDto);
      return token;
    } catch (error) {
      throw new HttpException(
        'Error Logging In',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/forgot')
  async forgot(@Body() forgotDto: ForgotDto) {
    try {
      const token = await this.authService.forgot(forgotDto);
      return token;
    } catch (error) {
      throw new HttpException(
        'Error sending password reset link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/reset')
  async reset(@Body() resetDto: ResetDto) {
    try {
      const message = await this.authService.reset(resetDto);
      return message;
    } catch (error) {
      throw error;
    }
  }
}
