import {Body, Controller, Get, Param, Post, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import User from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers(): Promise <User[]> {
        try {
            const users = await this.userService.getAllUsers()
            return users
        } catch (error) {
            throw new HttpException('Error fetching users', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get(':name')
    async getUserById(@Param('name') name: string): Promise<User> {
        try {
            const user = await this.userService.getUserById(name)
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND)
            }
            return user
        } catch(error) {
            if (error.status === HttpStatus.NOT_FOUND) {
                throw error
            }
            throw new HttpException('Error fetching User', HttpStatus.INTERNAL_SERVER_ERROR)
        } 
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createUser(@Body() createUserDto: CreateUserDto) {
        try {
            const newUser = await this.userService.createUser(createUserDto)
            return newUser
        } catch(error) {
            throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete(':name')
    async deleteByName(@Param('name') name : string): Promise<User> {
        try {
            const user = this.userService.deleteByName(name)
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND)
            }
            return user
        } catch(error) {
            if (error.statue === HttpStatus.NOT_FOUND) {
                throw error
            }
            throw new HttpException('Error deleting User', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
