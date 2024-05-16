import { Query } from "@nestjs/common";
import { IsNotEmpty, IsString, MinLength } from "class-validator";
export class ResetDto {
    @IsNotEmpty()
    @IsString()
    token: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}

