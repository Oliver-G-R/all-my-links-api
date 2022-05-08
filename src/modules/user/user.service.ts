import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId, ObjectId } from 'mongoose'
import { UserDto } from './dtos/user.dto'
import { User } from './schema/user.schema'
import { Link } from '../links/schema/link.schema'

@Injectable()
export class UserService {
  constructor (
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Link') private readonly linkModel: Model<Link>
  ) {}

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

  findById = async (id: ObjectId) => {
    if (isValidObjectId(id)) {
      const userFindId =
        await this.userModel.findById(id)
          .populate('links', '', this.linkModel)

      if (userFindId) return userFindId as User
      else throw new NotFoundException('User not found')
    }

    throw new BadRequestException('Invalid id')
  }

  findAll = async (): Promise<User[]> =>
    await this.userModel.find()
      .populate('links', '', this.linkModel)
}
