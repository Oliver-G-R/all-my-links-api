import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { SignInDto } from './Dtos/signIn.dto'
import { User } from '../user/schema/user.schema'
import { JwtService } from '@nestjs/jwt'
import { HashPassword } from '../../utils/HashPassword'
import { JWTResponse } from '../../types/JWT'
import { UserDto } from '../user/dtos/user.dto'

@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  signIn = async ({ nickNameOrEmail, password }: SignInDto):Promise<JWTResponse> => {
    const emailOrNickNameExcist = await this.userService.findByEmailOrNickName(nickNameOrEmail)

    if (emailOrNickNameExcist) {
      const matchPassword = HashPassword.comparePassword(password, emailOrNickNameExcist.password)

      if (matchPassword) return this.generateJWT(emailOrNickNameExcist)
      else throw new NotFoundException('User or email is not correct')
    }
    throw new NotFoundException('User or email is not correct')
  }

  generateJWT (user: User): JWTResponse {
    const { nickName, email, id } = user
    const payload = { nickName, email, id }
    return {
      user,
      token: this.jwtService.sign(payload)
    }
  }

  async signUp (data: UserDto): Promise<JWTResponse> {
    const user = await this.userService.create(data)
    if (user) {
      return this.generateJWT(user)
    } else throw new BadRequestException('User exist')
  }
}
