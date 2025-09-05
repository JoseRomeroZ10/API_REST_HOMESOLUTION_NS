import {BadRequestException,Injectable,InternalServerErrorException,UnauthorizedException,} from '@nestjs/common';
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
      message: ' Ve a tu correo y verifica que eres tu ',
    };
  }

  async Login(
    loginDto: LoginDto,
  ): Promise<{ refreshToken: string; accessToken: string; email: string }> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    console.log('Payload antes de firmar:', {
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    if (!accessToken) {
      throw new Error('No se pudo generar el token');
    }

    return {
      accessToken,
      refreshToken,
      email: user.email,
    };
  }

  //funciones adicinales

  async RefreshToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (!payload || !payload.email || !payload.sub) {
        throw new BadRequestException('Token inválido o incompleto');
      }

      const newAccessToken = await this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
          role: payload.role,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        },
      );

      if (!newAccessToken) {
        throw new InternalServerErrorException(
          'No se pudo generar el nuevo token',
        );
      }

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('Token expirado o inválido');
    }
  }

  async profile({ email, role }: { email: string; role: string }) {
    return await this.usersService.findOneByEmail(email);
  }
}
