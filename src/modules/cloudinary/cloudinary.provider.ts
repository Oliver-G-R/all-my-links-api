import { v2 } from 'cloudinary'
import { ConfigService } from '@nestjs/config'

export const CloudinaryProvider = {
  provide: ConfigService,
  useFactory: (configService:ConfigService) => {
    return v2.config({
      cloud_name: configService.get('cloudinary.cloud_name'),
      api_key: configService.get('cloudinary.api_key'),
      api_secret: configService.get('cloudinary.api_secret')
    })
  }
}
