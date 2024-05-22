import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { CreateUserDto } from './dto/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    try {
      const users = await this.userRepository.find();
      if (!users)
        throw new HttpException(
          'Unable to get Users',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      return user;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Unable to fetch user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    try {
      await this.userRepository.save({
        fullname: createUserDto.fullname,
        email: createUserDto.email,
        password: createUserDto.password,
      });

      if (newUser)
        throw new HttpException(
          'Unable to create user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      return await this.userRepository.remove(user);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Error fetching user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
