import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDto } from './dtos/user.dto'
import { User } from './schema/user.schema'

@Injectable()
export class UserService {
  constructor (@InjectModel('User') private readonly userModel: Model<User>) {}

  async create (user: UserDto): Promise<User> {
    const createdUser = new this.userModel(user)
    return await createdUser.save()
  }

  findAll = async () => await this.userModel.find()
}