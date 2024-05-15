import {Body, Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import User from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers(): Promise <User[]> {
        const users = await this.userService.getAllUsers()
        return users
    }

    @Get(':name')
    async getUserById(@Param('name') name: string): Promise<User> {
        const user = await this.userService.getUserById(name)
        return user
    } 

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createUser(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.userService.createUser(createUserDto)
        return newUser
    }

    @Delete(':name')
    async deleteByName(@Param('name') name : string): Promise<User> {
        const user = this.userService.deleteByName(name)
        return user
    }
}
