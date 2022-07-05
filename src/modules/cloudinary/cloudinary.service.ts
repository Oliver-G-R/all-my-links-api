import { Injectable, BadRequestException } from '@nestjs/common'
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary'
import { Express } from 'express'
const toStream = require('buffer-to-stream')
@Injectable()
export class CloudinaryService {
  uploadAvatar (file: Express.Multer.File, nickName:string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({
        folder: nickName,
        transformation: [
          { width: 500, height: 500, crop: 'scale' }
        ]
      }, (error, result) => {
        if (error) return reject(error)
        resolve(result)
      })
      toStream(file.buffer).pipe(upload)
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
