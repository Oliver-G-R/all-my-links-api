import { UserService } from './../user/user.service'
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isValidObjectId, Model, ObjectId } from 'mongoose'
import { Link } from './schema/link.schema'
import { User } from '../user/schema/user.schema'
import { LinkDto } from './dto/LinkDto'

@Injectable()
export class LinksService {
  constructor (
      @InjectModel('Link') private readonly linksModel:Model<Link>,
      @InjectModel('User') private readonly userModel:Model<User>,
      private userService:UserService
  ) {}

  findById = async (id:ObjectId) => {
    if (isValidObjectId(id)) {
      const findLInk = await this.linksModel.findById(id)
        .populate('user', ['email', 'nickName'], this.userModel)

      if (findLInk) return findLInk
      else throw new NotFoundException('Link not found')
    }
    throw new BadRequestException('Id is not valid')
  }

  getALlLInks = async (userId: ObjectId) =>
    await this.linksModel.find({ user: userId })
      .populate('user', ['email', 'nickName'], this.userModel)

  create = async (data:LinkDto, userId:ObjectId) => {
    const userFindById = await this.userService.findById(userId)
    if (userFindById) {
      const newLink = await new this.linksModel({
        user: userId,
        ...data
      }).save()
      userFindById.links.push(newLink.id)
      await userFindById.save()
      return newLink
    }

    throw new NotFoundException('Link not save')
  }
}
