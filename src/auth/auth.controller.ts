import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { Auth } from './decorators/auth.decorator';
import { UserActiveInterface } from '../common/interface/user-active.interface';
import { ActiveUser } from '../common/decorators/active_user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { ChancePasswordDto } from './dto/change-password.dto';

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
    const a = 1
    return;
  }
    @Get('profile')
    @Auth(UserRole.ADMIN)
    profile( @ActiveUser() user: UserActiveInterface){ {
    return user;
    }
}

  @Post('refresh')
  refresh(@Req() req) {
    const { token }  = req.headers;
    return this.authService.RefreshToken( token );
  }
}
