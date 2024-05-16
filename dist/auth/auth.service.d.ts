import { Repository } from 'typeorm';
import User from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    forgot(forgotDto: ForgotDto): Promise<string>;
    reset(resetDto: ResetDto): Promise<{
        message: string;
    }>;
    private validateResetToken;
}
