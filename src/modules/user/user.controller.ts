import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './schema/user.schema'

@Controller('user')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll (): Promise<User[]> {
    return this.userService.findAll()
  }
}
