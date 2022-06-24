
import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './Dtos/signIn.dto'
import { UserDto } from '../user/dtos/user.dto'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('/signIn')
  signIN (@Body() body: SignInDto) {
    return this.authService.signIn(body)
  }

  @Post('/signUp')
  signUp (@Body() body: UserDto) {
    console.log(body)
    return this.authService.signUp(body)
  }
}
