import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { Document } from 'mongoose'

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  @IsEmail({ message: 'This email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
    email: string

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
    password: string

  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty({ message: 'Nickname is required' })
    nickname: string
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret.__v
    delete ret._id
    delete ret.password
  }
})
