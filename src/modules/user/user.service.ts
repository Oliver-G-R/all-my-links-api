import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId, ObjectId } from 'mongoose'
import { UpdateUserDto } from './dtos/user.dto'
import { User } from './schema/user.schema'
import { Link } from '../links/schema/link.schema'
import { Express } from 'express'
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service'
import { removeFile } from 'src/utils/images'
import { JWTPayloadAfterConfirm } from 'src/types/JWT'
@Injectable()
export class UserService {
  constructor (
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Link') private readonly linkModel: Model<Link>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  create = async (data: JWTPayloadAfterConfirm): Promise<User> => {
    const { email, nickName } = data
    const userExists = await this.userModel.findOne({
      $or: [{ email }, { nickName }]
    })

    if (!userExists) {
      return await new this.userModel({
        ...data,
        password: data.pass
      }).save()
    } else {
      throw new BadRequestException('User already exists')
    }
  }

  findByEmailOrNickName = async (nickNameOrEmail: string):Promise<User> =>
    await this.userModel.findOne({
      $or: [{ email: nickNameOrEmail }, { nickName: nickNameOrEmail }]
    })

  findNickName = async (nickName: string): Promise<User> => {
    const user = await this.userModel.findOne({ nickName })
      .populate('links', '', this.linkModel)
      .populate('principalAccount', '', this.linkModel)

    if (user) return user
    throw new BadRequestException('User not Found')
  }

  findById = async (id: ObjectId) => {
    if (isValidObjectId(id)) {
      const userFindId =
        await this.userModel.findById(id)
          .populate('links', '', this.linkModel)
          .populate('principalAccount', '', this.linkModel)

      if (userFindId) return userFindId
      else throw new NotFoundException('User not found')
    }

    throw new BadRequestException('Invalid id')
  }

  findAll = async (): Promise<User[]> =>
    await this.userModel.find()
      .populate('links', '', this.linkModel)
      .populate('principalAccount', '', this.linkModel)

  findGlobalUsers = async () =>
    await this.userModel.find({}, { nickName: 1, avatar_url: 1, fullName: 1 })
      .populate('principalAccount', '', this.linkModel)

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
          .populate('principalAccount', '', this.linkModel)

        return updatedUser
      }
      throw new NotFoundException('User not found')
    }
    throw new BadRequestException('Invalid id')
  }

  uploadAvatar = async (id:ObjectId, file:Express.Multer.File):Promise<{avatar_url: string}> => {
    if (!file) throw new BadRequestException('Invalid File')
    if (isValidObjectId(id)) {
      const userFindById = await this.userModel.findById(id)
      if (userFindById) {
        try {
          const { public_id, secure_url } = await this.cloudinaryService.uploadAvatar(file, userFindById.nickName)
          await this.userModel.findByIdAndUpdate(id, { avatar_public_id: public_id, avatar_url: secure_url }, { new: true })
          removeFile(file.path)
          return { avatar_url: secure_url }
        } catch (error) {
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

  setPrincipalAccount = async (idLink:ObjectId) => {
    if (!isValidObjectId(idLink)) throw new BadRequestException('This id is not valid')

    const findLink = await this.linkModel.findById(idLink)

    if (!findLink) throw new NotFoundException('Not found link in this account')

    const updatedUser = await this.userModel.findByIdAndUpdate(findLink.user,
      { $set: { principalAccount: findLink.id } }, { new: true })
      .populate('principalAccount', '', this.linkModel)

    return updatedUser.principalAccount
  }

  removePrincipalAccount = async (idLink:ObjectId) => {
    if (!isValidObjectId(idLink)) throw new BadRequestException('This id is not valid')

    const findLink = await this.linkModel.findById(idLink)

    if (!findLink) throw new NotFoundException('Not found link in this account')

    await this.userModel.findByIdAndUpdate(findLink.user,
      { $set: { principalAccount: null } }, { new: true })
  }
}
