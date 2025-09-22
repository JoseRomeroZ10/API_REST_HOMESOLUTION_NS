import { Body, Controller, Get, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';

import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active_user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { ChancePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { UserActiveInterface } from '../common/interface/user-active.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  Login(@Body() loginDto: LoginDto) {
    return this.authService.Login(loginDto);
  }

  @Post('register')
  Register(@Body() registerDto: RegisterDto) {
    return this.authService.Register(registerDto);
  }

  //metodos adicionales al crud

  @Patch('/chance_password')
  @UseGuards(AuthGuard)
  changePassword(@Body() chancePasswordDto:ChancePasswordDto, @ActiveUser() user: UserActiveInterface){
  return this.authService.changePassword(chancePasswordDto,user)
  }
    @Get('profile')
    @Auth(UserRole.ADMIN)
    profile( @ActiveUser() user: UserActiveInterface){ {
    return user;
    }
}

 @Post('refresh')
  refresh(@Req() req: Request) {
  const authHeader = req.headers['authorization'];
  const [type, token] = authHeader?.split(' ') ?? [];
  if (type !== 'Bearer' || !token) throw new UnauthorizedException();
  return this.authService.refreshToken(token);
}

}
