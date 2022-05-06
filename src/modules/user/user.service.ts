import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId } from 'mongoose'
import { UserDto } from './dtos/user.dto'
import { User } from './schema/user.schema'

@Injectable()
export class UserService {
  constructor (@InjectModel('User') private readonly userModel: Model<User>) {}

  create = async (user: UserDto): Promise<User | object> => {
    const { email, nickname } = user
    const userExists = await this.userModel.findOne({
      $or: [{ email }, { nickname }]
    })

    return userExists
      ? new BadRequestException('User already exists').getResponse() as Object
      : await new this.userModel(user).save()
  }

  findById = async (id: string): Promise<User | object> => {
    if (isValidObjectId(id)) {
      return await this.userModel.findById(id) ||
        new NotFoundException('User not found').getResponse() as object
    }

    return new BadRequestException('Invalid id').getResponse() as object
  }

  findAll = async (): Promise<User[]> => await this.userModel.find()
}
