import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  UnauthorizedException
} from '@nestjs/common'
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
    @Inject(ConfigService) private configService: ConfigService
  ) {}

  generateJWT (user: User, ex?:string): JWTResponse {
    const { nickName, email, id } = user
    const payload = { nickName, email, id }
    return {
      user,
      token: this.jwtService.sign(payload, {
        expiresIn: ex || this.configService.get('jwt.expiresIn')
      })
    }
  }

  generateJWTForEmailConfirmation (user: UserDto) {
    const { email, fullName, nickName, password } = user

    const hashedPassword = HashPassword.hash(password)

    const payload: JWTPayloadAfterConfirm = {
      email,
      fullName,
      nickName,
      pass: hashedPassword
    }
    return this.jwtService.sign(payload, {
      expiresIn: '1m'
    })
  }

  signIn = async ({
    nickNameOrEmail,
    password
  }: SignInDto): Promise<JWTResponse> => {
    const emailOrNickNameExcist = await this.userService.findByEmailOrNickName(
      nickNameOrEmail
    )

    if (emailOrNickNameExcist) {
      const matchPassword = HashPassword.comparePassword(
        password,
        emailOrNickNameExcist.password
      )

      if (matchPassword) return this.generateJWT(emailOrNickNameExcist)
      else throw new NotFoundException('User or email is not correct')
    }
    throw new NotFoundException('User or email is not correct')
  }

  async signUp (data: UserDto): Promise<{ message: string }> {
    const userExists = await this.userModel.findOne({
      $or: [{ email: data.email }, { nickName: data.nickName }]
    })

    if (!userExists) {
      return await this.sendConfirmationEmail(data)
    } else throw new BadRequestException('User exist')
  }

  async validateJWT (token:string) {
    try {
      return await this.jwtService.verify<JWTPayloadAfterConfirm>(
        token,
        {
          secret: this.configService.get('jwt.secret')
        }
      )
    } catch (error) {
      throw new UnauthorizedException('Invalid token or token expired')
    }
  }

  async createUserAfterConfirmation (token: string) {
    const userFromToken: JWTPayloadAfterConfirm = await this.validateJWT(token)

    if (userFromToken) {
      const user = await this.userService.create(userFromToken)
      await this.sendConfirmedEmail(userFromToken.email, `
          Hello ${userFromToken.fullName},
          Your email has been confirmed.
          You can now sign in to your account.
        `, 'Welcome to All My Links, email confirmed')
      return this.generateJWT(user)
    }
  }

  async sendConfirmedEmail (emailUser: string, text:string, subject:string) {
    await this.mailerService.sendMail({
      to: emailUser,
      subject,
      text
    })
  }

  async sendConfirmationEmail (user: UserDto): Promise<{
    message: string;
  }> {
    const userExists = await this.userModel.findOne({
      $or: [{ email: user.email }, { nickName: user.nickName }]
    })

    if (!userExists) {
      const token = this.generateJWTForEmailConfirmation(user)
      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Welcome to All My Links, email confirmation',
          text: `
            Welcome to All My Links
            
            Please confirm your email by clicking the link below:
            
            ${this.configService.get('front.verifyUrl')}?token=${token}
          `
        })
        return {
          message: 'Confirmation email has been sent'
        }
      } catch (error) {
        throw new BadRequestException('Confirmation email has not been sent')
      }
    } else {
      throw new BadRequestException('This email is already confirmed')
    }
  }

  async forgotPassword (email: string) {
    const user = await this.userModel.findOne({ email })

    if (user) {
      const generateToken = this.generateJWT(user, '5m')
      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'All My Links, password reset',
          text: `
            Hello ${user.nickName},
            Please click the link below to reset your password:
            
            ${this.configService.get('front.resetPasswordUrl')}?token=${generateToken.token}
          `
        })
        return {
          message: 'Password reset email has been sent'
        }
      } catch (error) {
        throw new BadRequestException('Password reset email has not been sent')
      }
    } else {
      throw new NotFoundException('User not found')
    }
  }

  async resetPassword (token: string, password: string):Promise<JWTResponse> {
    const userFromToken = await this.validateJWT(token)

    if (userFromToken) {
      const user = await this.userModel.findOne({ email: userFromToken.email })

      if (user) {
        const hashedPassword = HashPassword.hash(password)
        user.password = hashedPassword
        await user.save()
        await this.sendConfirmedEmail(userFromToken.email, `
          Hello ${user.fullName},
          Your password has been reset.
          You can now sign in to your account.
        `, 'Password reset')

        return this.generateJWT(user)
      } else {
        throw new NotFoundException('User not found')
      }
    }
  }
}
