import * as bcryptjs from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { UsersService } from '../users/users.service';
import { ChancePasswordDto } from './dto/change-password.dto';
import { UserActiveInterface } from 'src/common/interface/user-active.interface';

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
      message: ' Ve a tu correo y verifica que eres tu ',
    };
  }

async Login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  const user = await this.usersService.findOneByEmail(email);
  if (!user || !(await bcryptjs.compare(password, user.password))) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  const accessToken = await this.jwtService.signAsync(
    { sub: user.id, email: user.email, role: user.role },
    {
      secret: process.env.JWT_SECRET,
      expiresIn: '60s',
    },
  );

  const refreshToken = await this.jwtService.signAsync(
    { sub: user.id, email: user.email },
    {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '2m',
    },
  );

  return { accessToken, refreshToken, user };
}


  async refreshToken(token: string): Promise<string> {
  try {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    if (!payload || typeof payload.sub !== 'number' || typeof payload.email !== 'string') {
      throw new BadRequestException('Payload inválido');
    }

    const newAccessToken = await this.jwtService.signAsync(
      { sub: payload.sub, email: payload.email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '2m',
      },
    );

    return newAccessToken;
  } catch (error) {
    console.error('Error al renovar token:', error);
    throw new UnauthorizedException('Refresh token inválido o expirado');
  }
}
  //funciones adicinales

  async changePassword(
    chancePasswordDto: ChancePasswordDto,
    user: UserActiveInterface,
  ): Promise<{ message: string }> {
    const { oldPassword, newPassword } = chancePasswordDto;

    const usuario = await this.usersService.findByEmailWithPassword(user.email);
    if (!usuario || !(await bcryptjs.compare(oldPassword, usuario.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException('La nueva contraseña debe ser distinta');
    }

    const nuevaHash = await bcryptjs.hash(newPassword, 10);
    await this.usersService.updatePassword(usuario.id, nuevaHash);

    return { message: 'Contraseña actualizada' };
  }

  async profile({ email, role }: { email: string; role: string }) {
    return await this.usersService.findOneByEmail(email);
  }
}
