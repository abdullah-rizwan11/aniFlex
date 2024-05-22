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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const typeorm_2 = require("typeorm");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAllUsers() {
        try {
            const users = await this.userRepository.find();
            if (!users)
                throw new common_1.HttpException('Unable to get Users', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            return users;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    email
                }
            });
            if (!user)
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            return user;
        }
        catch (error) {
            if (error.status === common_1.HttpStatus.NOT_FOUND) {
                throw error;
            }
            throw new common_1.HttpException('Unable to fetch user', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createUser(createUserDto) {
        const newUser = await this.userRepository.create(createUserDto);
        await this.userRepository.save({
            fullname: createUserDto.fullname,
            email: createUserDto.email,
            password: createUserDto.password
        });
        return newUser;
    }
    async deleteByEmail(email) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    email
                }
            });
            if (!user)
                throw new common_1.HttpException("User not found", common_1.HttpStatus.NOT_FOUND);
            return await this.userRepository.remove(user);
        }
        catch (error) {
            if (error.status === common_1.HttpStatus.NOT_FOUND) {
                throw error;
            }
            throw new common_1.HttpException("Error fetching user", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map