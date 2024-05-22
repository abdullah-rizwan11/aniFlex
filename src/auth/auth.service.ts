import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from 'src/user/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotDto } from './dto/forgot.dto';
import { randomBytes } from 'crypto';
import { ResetDto } from './dto/reset.dto';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      const { fullname, email, password } = signUpDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersRepository.create({
        fullname,
        email,
        password: hashedPassword,
      });

      const saved = await this.usersRepository.save(user);
      const token = this.jwtService.sign({ id: user.id}, {expiresIn: '1h'});
      return { token };
    }
    catch (error) {
      if (error.code === '23505') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      console.log(error)
      throw new HttpException('Error signing up', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user.id }, {expiresIn: '1h'});
    return { token };
  }

  async forgot(forgotDto : ForgotDto) {
    const { email } = forgotDto
    const user = await this.usersRepository.findOne({
      where: {
        email
      }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokenBytes = randomBytes(10);
    const resetToken = tokenBytes.toString('hex');
    const expiryTimestamp = Date.now() + 2 * 60 * 1000;
    const tokenWithExpiry = `${resetToken}.${expiryTimestamp}`;
    user.resetLink = tokenWithExpiry
    await this.usersRepository.save(user)
    return tokenWithExpiry;
  }

  async reset(resetDto : ResetDto) {
    const {token : resetLink, password} = resetDto
    const isValidToken = this.validateResetToken(resetLink);
    if (!isValidToken) {
      throw new Error('Reset token is invalid or expired');
    }

    const user = await this.usersRepository.findOne({ where: { resetLink } })
    user.password = await bcrypt.hash(password, 10)
    user.resetLink = null
    await this.usersRepository.save(user)
    return {message: "Password has been set successfully"}
  }

  private validateResetToken(resetToken: string): boolean {
    const [, expiryTimestampStr] = resetToken.split('.');
    const expiryTimestamp = parseInt(expiryTimestampStr, 10);
    return !isNaN(expiryTimestamp) && Date.now() <= expiryTimestamp;
  }
  
}