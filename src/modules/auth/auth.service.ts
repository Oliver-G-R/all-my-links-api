import { Injectable, NotFoundException, BadRequestException, Inject, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { SignInDto } from './Dtos/signIn.dto'
import { User } from '../user/schema/user.schema'
import { JwtService } from '@nestjs/jwt'
import { HashPassword } from '../../utils/HashPassword'
import { JWTPayloadAfterConfirm, JWTResponse } from '../../types/JWT'
import { UserDto } from '../user/dtos/user.dto'
import { MailerService } from '@nestjs-modules/mailer'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(ConfigService) private configService:ConfigService

  ) {
  }

  generateJWT (user: User): JWTResponse {
    const { nickName, email, id } = user
    const payload = { nickName, email, id }
    return {
      user,
      token: this.jwtService.sign(payload)
    }
  }

  generateJWTForEmailConfirmation (user: UserDto) {
    const { email, fullName, nickName, password } = user

    const hashedPassword = HashPassword.hash(password)

    const payload: JWTPayloadAfterConfirm = { email, fullName, nickName, pass: hashedPassword }
    return this.jwtService.sign(payload, {
      expiresIn: '1m'
    })
  }

  signIn = async ({ nickNameOrEmail, password }: SignInDto):Promise<JWTResponse> => {
    const emailOrNickNameExcist = await this.userService.findByEmailOrNickName(nickNameOrEmail)

    if (emailOrNickNameExcist) {
      const matchPassword = HashPassword.comparePassword(password, emailOrNickNameExcist.password)

      if (matchPassword) return this.generateJWT(emailOrNickNameExcist)
      else throw new NotFoundException('User or email is not correct')
    }
    throw new NotFoundException('User or email is not correct')
  }

  async signUp (data: UserDto):Promise<{message: string}> {
    const userExists = await this.userModel.findOne({
      $or: [{ email: data.email }, { nickName: data.nickName }]
    })

    if (!userExists) {
      await this.sendConfirmationEmail(data)
      return {
        message: 'Confirmation email has been sent'
      }
    } else throw new BadRequestException('User exist')
  }

  async sendConfirmedEmail (user:JWTPayloadAfterConfirm) {
    const { email, fullName } = user
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to All My Links, email confirmed',
      text: `
        Hello ${fullName},
        Your email has been confirmed.
        You can now sign in to your account.
      `
    })
  }

  async createUserAfterConfirmation (token: string) {
    let userFromToken: JWTPayloadAfterConfirm

    try {
      // eslint-disable-next-line no-unused-vars
      userFromToken = await this.jwtService.verify<JWTPayloadAfterConfirm>(token, {
        secret: this.configService.get('jwt.secret')
      })
    } catch (error) {
      throw new UnauthorizedException('Invalid token or token expired')
    }

    if (userFromToken) {
      const user = await this.userService.create(userFromToken)
      await this.sendConfirmedEmail(userFromToken)
      return this.generateJWT(user)
    }
  }

  async sendConfirmationEmail (user:UserDto) {
    const token = this.generateJWTForEmailConfirmation(user)
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to All My Links, email confirmation',
      text: `
        Welcome to All My Links
        
        Please confirm your email by clicking the link below:
        
        ${this.configService.get('front.verifyUrl')}?token=${token}
      `
    })
  }
}
