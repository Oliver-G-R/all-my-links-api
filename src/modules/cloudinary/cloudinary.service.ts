import { Injectable, BadRequestException } from '@nestjs/common'
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary'
import { Express } from 'express'
@Injectable()
export class CloudinaryService {
  async uploadAvatar (file: Express.Multer.File, nickName:string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return await v2.uploader.upload(file.path, {
      folder: nickName,
      transformation: [
        { width: 500, height: 500, crop: 'scale' }
      ]
    })
  }

  async updateAvatar (file: Express.Multer.File, nickName:string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return await v2.uploader.upload(file.path, {
      folder: nickName,
      transformation: [
        { width: 500, height: 500, crop: 'scale' }
      ]
    })
  }

  async removeAvatar (publicId:string) {
    try {
      await v2.uploader.destroy(publicId)
    } catch (error) {
      throw new BadRequestException('Error to remove avatar')
    }
  }
}
