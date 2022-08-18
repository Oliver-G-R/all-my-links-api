
import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './Dtos/signIn.dto'
import { UserDto } from '../user/dtos/user.dto'
import { JWTResponse } from 'src/types/JWT'
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { forgotPasswordDto } from './Dtos/forgotpassword'
@UseGuards(ThrottlerGuard)
@Throttle(1, 2 * 60)
@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @SkipThrottle(true)
  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  signIN (@Body() body: SignInDto):Promise<JWTResponse> {
    return this.authService.signIn(body)
  }

  @Throttle(3, 5 * 60)
  @Post('/signUp')
  @HttpCode(HttpStatus.OK)
  signUp (@Body() body: UserDto):Promise<{message:string}> {
    return this.authService.signUp(body)
  }

  @Post('/create-user-after-confirmation/:token')
  @HttpCode(HttpStatus.OK)
  verifyEmail (@Param('token') token: string) {
    return this.authService.createUserAfterConfirmation(token)
  }

  @Post('/confirm-email')
  @HttpCode(HttpStatus.OK)
  confirmEmail (@Body() body: UserDto) {
    return this.authService.sendConfirmationEmail(body)
  }

  @Post('/send-mail-forgot-password')
  @HttpCode(HttpStatus.OK)
  sendMailToResetPassword (@Body() body: forgotPasswordDto) {
    return this.authService.forgotPassword(body.email)
  }

  @Post('/reset-password/:token')
  @HttpCode(HttpStatus.OK)
  reetPassword (@Param('token') token: string, @Body('password') password: string): Promise<JWTResponse> {
    return this.authService.resetPassword(token, password)
  }
}
