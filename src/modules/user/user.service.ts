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

    if (!userExists) { return await new this.userModel(data).save() }
  }

  findByEmailOrNickName = async (nickNameOrEmail: string):Promise<User> =>
    await this.userModel.findOne({
      $or: [{ email: nickNameOrEmail }, { nickName: nickNameOrEmail }]
    })

  findNickName = async (nickName: string): Promise<User> =>
    await this.userModel.findOne({ nickName }).populate('links', '', this.linkModel)

  findById = async (id: ObjectId) => {
    if (isValidObjectId(id)) {
      const userFindId =
        await this.userModel.findById(id)
          .populate('links', '', this.linkModel)

      if (userFindId) return userFindId
      else throw new NotFoundException('User not found')
    }

    throw new BadRequestException('Invalid id')
  }

  findAll = async (): Promise<User[]> =>
    await this.userModel.find()
      .populate('links', '', this.linkModel)

  findGlobalUsers = async (currentUserId:ObjectId)/* : Promise<User[]> */ => {
    if (currentUserId) {
      const users = await this.userModel.find(
        { _id: { $ne: currentUserId } },
        { nickName: 1, links: 1 })
        .populate('links', '', this.linkModel)
      return users
    } else {
      const users = await this.userModel.find({}, { nickName: 1, links: 1 })
        .populate('links', '', this.linkModel)

      return users
    }
  }

  remove = async (id:ObjectId) => {
    if (isValidObjectId(id)) {
      const userFindById = await this.userModel.findById(id)
      if (userFindById) {
        await this.userModel.findByIdAndRemove(id)
        await this.linkModel.deleteMany({ user: id })
        return userFindById
      }

      throw new NotFoundException('User not found')
    }
    throw new BadRequestException('Invalid id')
  }

  updateProfile = async (id:ObjectId, data:UserDto) => {
    if (isValidObjectId(id)) {
      const userFindById = await this.userModel.findById(id)
      if (userFindById) {
        await this.userModel.findByIdAndUpdate(id, data, { new: true })
        return userFindById
      }

      throw new NotFoundException('User not found')
    }
    throw new BadRequestException('Invalid id')
  }
}
