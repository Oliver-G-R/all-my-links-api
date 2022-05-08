import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './schema/user.schema'
import { LinkSchema } from '../links/schema/link.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{
      name: 'Link', schema: LinkSchema
    }])
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService]
})
export class UserModule {}
