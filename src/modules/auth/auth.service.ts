import { Injectable } from '@nestjs/common'
import { SignUpDto } from './Dtos/signUp.dto'
import { UserService } from '../user/user.service'
import { SignInDto } from './Dtos/signIn.dto'
import { User } from '../user/schema/user.schema'

@Injectable()
export class AuthService {
  constructor (private userService: UserService) {}

  signIn ({ email, password }: SignInDto) {
    return { email, password }
  }

  signUp (data: SignUpDto): Promise<User | object> {
    return this.userService.create(data)
  }
}
