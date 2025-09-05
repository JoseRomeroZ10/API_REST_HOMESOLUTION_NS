import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,

  IsString,
} from 'class-validator';
import { UserGender } from '../../common/enums/user-gender.enum';

export class CreateUserDto {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(UserGender)
  gender: UserGender;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  age: number;

}
