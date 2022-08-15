
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './Dtos/signIn.dto'
import { UserDto } from '../user/dtos/user.dto'
import { JWTResponse } from 'src/types/JWT'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  signIN (@Body() body: SignInDto):Promise<JWTResponse> {
    return this.authService.signIn(body)
  }

  @Post('/signUp')
  @HttpCode(HttpStatus.OK)
  signUp (@Body() body: UserDto):Promise<{message:string}> {
    return this.authService.signUp(body)
  }

  @Get('/create-user-after-confirmation/:token')
  @HttpCode(HttpStatus.OK)
  verifyEmail (@Param('token') token: string) {
    return this.authService.createUserAfterConfirmation(token)
  }
}
