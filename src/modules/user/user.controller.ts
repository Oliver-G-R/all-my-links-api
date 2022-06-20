import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors, Put, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './schema/user.schema'
import { ObjectId } from 'mongoose'
import { Auth } from '@modules/auth/auth.decorator'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { UpdateUserDto } from './dtos/user.dto'
@Controller('user')
export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll (): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get('get-by-nickName/:nickName')
  @HttpCode(HttpStatus.OK)
  findBynickName (@Param('nickName') nickName:string): Promise<User> {
    return this.userService.findNickName(nickName)
  }

  @Get('/global-users')
  @HttpCode(HttpStatus.OK)
  globalUsers (@Query('currentUserId') currentUserId?:ObjectId) {
    return this.userService.findGlobalUsers(currentUserId)
  }

  @Post('upload-avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar (@Auth() { id }: User, @UploadedFile() file: Express.Multer.File):Promise<{avatar_url: string}> {
    return this.userService.uploadAvatar(id, file)
  }

  @Put('remove-avatar')
  @UseGuards(AuthGuard('jwt'))
  removeAvatar (@Auth() { id }:User):Promise<{ messgae: string }> {
    return this.userService.removeAvatarToDb(id)
  }

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  profile (@Auth() { id }: User) {
    return this.userService.findById(id)
  }

  @Put('/update-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  updateProfile (@Auth() { id }: User, @Body() data: UpdateUserDto) {
    return this.userService.updateProfile(id, data)
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
