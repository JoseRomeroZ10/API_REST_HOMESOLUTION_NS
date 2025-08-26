import { IsNotEmpty, IsString } from "class-validator";

export class ActiveUserDto{

    @IsString()
    @IsNotEmpty()
     token: string;


}