
import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './Dtos/signIn.dto'
import { UserDto } from '../user/dtos/user.dto'
import { JWTResponse } from 'src/types/JWT'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  signIN (@Body() body: SignInDto):Promise<JWTResponse> {
    return this.authService.signIn(body)
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(3, 5 * 60)
  @Post('/signUp')
  @HttpCode(HttpStatus.OK)
  signUp (@Body() body: UserDto):Promise<{message:string}> {
    return this.authService.signUp(body)
  }

  @UseGuards(ThrottlerGuard)
  @Post('/create-user-after-confirmation/:token')
  @Throttle(1, 2 * 60)
  @HttpCode(HttpStatus.OK)
  verifyEmail (@Param('token') token: string) {
    return this.authService.createUserAfterConfirmation(token)
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(1, 2 * 60)
  @Post('/confirm-email')
  @HttpCode(HttpStatus.OK)
  confirmEmail (@Body() body: UserDto) {
    return this.authService.sendConfirmationEmail(body)
  }
}
