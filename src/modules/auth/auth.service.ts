import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { SignUpDto } from './Dtos/signUp.dto'
import { UserService } from '../user/user.service'
import { SignInDto } from './Dtos/signIn.dto'
import { User } from '../user/schema/user.schema'
import { JwtService } from '@nestjs/jwt'
import { HashPassword } from '../../utils/HashPassword'
import { ITokenResponse } from './interfaces/Token'

@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  signIn = async ({ nickNameOrEmail, password }: SignInDto):Promise<ITokenResponse> => {
    const emailOrNickNameExcist = await this.userService.findByEmailOrNickName(nickNameOrEmail)

    if (emailOrNickNameExcist) {
      const matchPassword = HashPassword.comparePassword(password, emailOrNickNameExcist.password)

      if (matchPassword) return this.generateJWT(emailOrNickNameExcist)
      else throw new NotFoundException('User or email is not correct')
    }
    throw new NotFoundException('User or email is not correct')
  }

  generateJWT (user: User): ITokenResponse {
    const { nickName, email, id } = user
    const payload = { nickName, email, id }
    return {
      user,
      token: this.jwtService.sign(payload)
    }
  }

  async signUp (data: SignUpDto): Promise<ITokenResponse> {
    const user = await this.userService.create(data)
    if (user) {
      return this.generateJWT(user)
    } else throw new BadRequestException('User exist')
  }
}
