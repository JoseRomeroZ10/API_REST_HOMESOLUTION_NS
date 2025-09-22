import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,

  IsString,
} from 'class-validator';

import { UserGender } from '../../common/enums/user-gender.enum';
import { IsPassword } from 'src/common/decorators/IsPassword.decorator';

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
  @IsPassword()
  password: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  age: number;

}
