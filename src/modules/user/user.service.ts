import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId } from 'mongoose'
import { UserDto } from './dtos/user.dto'
import { User } from './schema/user.schema'

@Injectable()
export class UserService {
  constructor (@InjectModel('User') private readonly userModel: Model<User>) {}

  create = async (data: UserDto): Promise<User> => {
    const { email, nickName } = data
    const userExists = await this.userModel.findOne({
      $or: [{ email }, { nickName }]
    })
    return !userExists && await new this.userModel(data).save()
  }

  findByEmailOrNickName = async (nickNameOrEmail: string):Promise<User> =>
    await this.userModel.findOne({
      $or: [{ email: nickNameOrEmail }, { nickName: nickNameOrEmail }]
    })

  findById = async (id: string) => {
    if (isValidObjectId(id)) {
      const userFindId = await this.userModel.findById(id)
      if (userFindId) return userFindId
      else throw new NotFoundException('User not found')
    }

    throw new BadRequestException('Invalid id')
  }

  findAll = async (): Promise<User[]> => await this.userModel.find()
}
