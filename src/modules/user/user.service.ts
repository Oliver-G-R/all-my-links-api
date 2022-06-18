import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId, ObjectId } from 'mongoose'
import { UserDto } from './dtos/user.dto'
import { User } from './schema/user.schema'
import { Link } from '../links/schema/link.schema'
import { Express } from 'express'
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service'
@Injectable()
export class UserService {
  constructor (
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Link') private readonly linkModel: Model<Link>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  create = async (data: UserDto): Promise<User> => {
    const { email, nickName } = data
    const userExists = await this.userModel.findOne({
      $or: [{ email }, { nickName }]
    })

    if (!userExists) {
      return await new this.userModel(data).save()
    }
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

  uploadAvatarToDb = async (id:ObjectId, file:Express.Multer.File):Promise<{messgae: string}> => {
    if (isValidObjectId(id)) {
      const userFindById = await this.userModel.findById(id)
      if (userFindById) {
        try {
          const { public_id, url } = await this.cloudinaryService.uploadAvatar(file, userFindById.nickName)
          await this.userModel.findByIdAndUpdate(id, { avatar_public_id: public_id, avatar_url: url }, { new: true })
          return { messgae: 'Avatar uploaded' }
        } catch (error) {
          console.log(error)
          throw new BadRequestException('Error to upload image')
        }
      } else throw new NotFoundException('User not found')
    } else throw new BadRequestException('Invalid id')
  }

  removeAvatarToDb = async (id:ObjectId):Promise<{messgae: string}> => {
    if (isValidObjectId(id)) {
      const userFindById = await this.userModel.findById(id)
      if (userFindById) {
        await this.cloudinaryService.removeAvatar(userFindById.avatar_public_id)
        await this.userModel.findByIdAndUpdate(id, { avatar_public_id: null, avatar_url: null }, { new: true })
        return { messgae: 'Avatar removed' }
      } else throw new NotFoundException('User not found')
    } else throw new NotFoundException('invalid id')
  }
}
