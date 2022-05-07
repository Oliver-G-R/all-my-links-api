import { Module } from '@nestjs/common'
import { LinksService } from './links.service'
import { LinksController } from './links.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { LinkSchema } from './schema/link.schema'
import { UserSchema } from '../user/schema/user.schema'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{
      name: 'Link', schema: LinkSchema
    }]),
    MongooseModule.forFeature([{
      name: 'User', schema: UserSchema
    }])
  ],
  providers: [LinksService],
  controllers: [LinksController]
})
export class LinksModule {}
