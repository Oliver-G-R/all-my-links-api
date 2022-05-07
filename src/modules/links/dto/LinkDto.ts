import { IsNotEmpty, IsString } from 'class-validator'
import { Schema as MongooseSchema } from 'mongoose'
export class LinkDto {
    @IsNotEmpty()
    @IsString()
      titleLink: string

    @IsNotEmpty()
    @IsString()
      link: string

    @IsNotEmpty()
    @IsString()
      socialName: string

    @IsNotEmpty()
    @IsString()
      socialIcon: string

    @IsNotEmpty()
      user: MongooseSchema.Types.ObjectId
}
