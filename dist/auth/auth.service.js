"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async signUp(signUpDto) {
        try {
            const { fullname, email, password } = signUpDto;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.usersRepository.create({
                fullname,
                email,
                password: hashedPassword,
            });
            const saved = await this.usersRepository.save(user);
            const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });
            return { token };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.HttpException('Email already exists', common_1.HttpStatus.CONFLICT);
            }
            console.log(error);
            throw new common_1.HttpException('Error signing up', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });
        return { token };
    }
    async forgot(forgotDto) {
        const { email } = forgotDto;
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const tokenBytes = (0, crypto_1.randomBytes)(10);
        const resetToken = tokenBytes.toString('hex');
        const expiryTimestamp = Date.now() + 2 * 60 * 1000;
        const tokenWithExpiry = `${resetToken}.${expiryTimestamp}`;
        user.resetLink = tokenWithExpiry;
        try {
            await this.usersRepository.save(user);
        }
        catch (error) {
            throw new common_1.HttpException('Unable to update user data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return tokenWithExpiry;
    }
    async reset(resetDto) {
        const { token: resetLink, password } = resetDto;
        const isValidToken = this.validateResetToken(resetLink);
        if (!isValidToken) {
            throw new Error('Reset token is invalid or expired');
        }
        const user = await this.usersRepository.findOne({ where: { resetLink } });
        user.password = await bcrypt.hash(password, 10);
        user.resetLink = null;
        try {
            await this.usersRepository.save(user);
        }
        catch (err) {
            throw new common_1.HttpException('Unable to store reset link', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return { message: "Password has been set successfully" };
    }
    validateResetToken(resetToken) {
        const [, expiryTimestampStr] = resetToken.split('.');
        const expiryTimestamp = parseInt(expiryTimestampStr, 10);
        return !isNaN(expiryTimestamp) && Date.now() <= expiryTimestamp;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map