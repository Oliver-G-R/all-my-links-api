import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId, ObjectId } from 'mongoose'
import { UpdateUserDto, UserDto } from './dtos/user.dto'
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

  findNickName = async (nickName: string): Promise<User> => {
    const user = await this.userModel.findOne({ nickName }).populate('links', '', this.linkModel)
    if (user) return user
    throw new BadRequestException('User not Found')
  }

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

  findGlobalUsers = async () =>
    await this.userModel.find({}, { nickName: 1, avatar_url: 1 })

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

  updateProfile = async (id:ObjectId, data:UpdateUserDto) => {
    if (isValidObjectId(id)) {
      const userFindById = await this.userModel.findById(id)
      const findEmailOrNickName = await this.userModel.findOne({
        $or: [{ email: data.email }, { nickName: data.nickName }],
        _id: { $ne: id }
      })
      if (findEmailOrNickName) throw new BadRequestException('This data alredy used')
      if (userFindById) {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, data, { new: true })
          .populate('links', '', this.linkModel)
        return updatedUser
      }
      throw new NotFoundException('User not found')
    }
    throw new BadRequestException('Invalid id')
  }

  uploadAvatar = async (id:ObjectId, file:Express.Multer.File):Promise<{avatar_url: string}> => {
    if (isValidObjectId(id)) {
      const userFindById = await this.userModel.findById(id)
      if (userFindById) {
        try {
          const { public_id, url } = await this.cloudinaryService.uploadAvatar(file, userFindById.nickName)
          await this.userModel.findByIdAndUpdate(id, { avatar_public_id: public_id, avatar_url: url }, { new: true })
          return { avatar_url: url }
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
