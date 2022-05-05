import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './Dtos/signUp.dto';
import { SignInDto } from './Dtos/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signIn')
  signIN(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('/signUp')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }
}
