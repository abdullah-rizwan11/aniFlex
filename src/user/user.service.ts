import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { CreateUserDto } from './dto/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>
    ) {}

    async getAllUsers() {
        const users = await this.userRepository.find()
        return users
    }

    async getUserById(fullname:string) {
        const user = await this.userRepository.findOne({
            where: {
                fullname: fullname
            }
        })

        if (user) return user
        throw new NotFoundException('User not found')
        
    }


    async createUser(createUserDto: CreateUserDto) {
        const newUser = await this.userRepository.create(createUserDto)
        await this.userRepository.save({
            fullname: createUserDto.fullname,
            email: createUserDto.email,
            password: createUserDto.password
        })
        return newUser
    }

    async deleteByName(name : string) {
        const user = await this.userRepository.findOne({
            where: {
                fullname: name
            }
        })

        if (!user) return null
        await this.userRepository.remove(user)
        return user
    }
}
