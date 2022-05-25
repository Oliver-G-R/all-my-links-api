import { Controller, Delete, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './schema/user.schema'
import { ObjectId } from 'mongoose'

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
  findById (@Param('id') id:ObjectId): Promise<User> {
    return this.userService.findById(id)
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  removeById (@Param('id') id:ObjectId) {
    return this.userService.remove(id)
  }
}
