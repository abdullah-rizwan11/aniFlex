import User from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<User[]>;
    getUserById(name: string): Promise<User>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    deleteByName(name: string): Promise<User>;
}
