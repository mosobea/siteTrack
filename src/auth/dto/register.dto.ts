import {IsString, IsEmail, MinLength} from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;
    //TODO:Rev
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(8)
    password: string;
}