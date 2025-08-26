import { Body, Controller, Get, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { Auth } from './decorators/auth.decorator';
import { UserActiveInterface } from '../common/interface/user-active.interface';
import { ActiveUser } from '../common/decorators/active_user.decorator';




@Controller('auth')
export class AuthController {


    constructor(
        private readonly authService: AuthService,
    ) {}
    @Post('login')
    Login( @Body() loginDto:LoginDto){
        return this.authService.Login(loginDto);
    }

    @Post('register')
    Register(@Body() registerDto: RegisterDto ){
        return this.authService.Register(registerDto)
    }
    

    //metodos adicionales al crud

    @Get('profile')
    @Auth(UserRole.ADMIN)
    profile( @ActiveUser() user: UserActiveInterface){ {
    return user;
    }
    }

}

