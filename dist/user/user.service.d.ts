import User from './user.entity';
import { CreateUserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getAllUsers(): Promise<User[]>;
    getUserByEmail(email: string): Promise<User>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    deleteByEmail(email: string): Promise<User>;
}
