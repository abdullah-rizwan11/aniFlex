import { Repository } from 'typeorm';
import User from 'src/user/user.entity';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    validate(payload: any): Promise<User>;
}
export {};
