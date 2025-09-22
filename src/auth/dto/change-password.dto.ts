import { IsNotEmpty, IsString } from "class-validator";
import { IsPassword } from "src/common/decorators/IsPassword.decorator";

export class ChancePasswordDto{
   
    @IsString()
    @IsNotEmpty()
    oldPassword:string;


    @IsString()
    @IsNotEmpty()
    @IsPassword()
    newPassword: string;
}