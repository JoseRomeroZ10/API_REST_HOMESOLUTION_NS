import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { UserGender } from "../../common/enums/user-gender.enum";
import { IsPassword } from "src/common/decorators/IsPassword.decorator";


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
    @IsPassword()
    password: string;

    @IsNumber()
    @IsNotEmpty()
    age: number;

}
