import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { UserGender } from "../../common/enums/user-gender.enum";


export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEnum(UserGender)
    gender: UserGender;
    
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNumber()
    @IsNotEmpty()
    age: number;

}
