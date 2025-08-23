import {BadRequestException,Injectable,UnauthorizedException,} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register-auth.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async Register(registerDto: RegisterDto) {
    const user = await this.usersService.findOneByEmail(registerDto.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }
    await this.usersService.create({
      ...registerDto,
      password: await bcryptjs.hash(registerDto.password, 10),
    });

    return {
      name: registerDto.name,
      email: registerDto.email,
    };
  }

  async Login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('User not Exists');
    }
    const isPasswordValid = await bcryptjs.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException ('Incorrect password');
    }

    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email: user.email,
    };
  }

  async profile({ email, role }: { email: string; role: string }) {
    return await this.usersService.findOneByEmail(email);
  }
}
