import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
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

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById (@Param('id') id:string): Promise<User | object> {
    return this.userService.findById(id)
  }
}
