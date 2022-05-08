import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { NextFunction } from 'express'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { HashPassword } from '../../../utils/HashPassword'

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
    email: string

  @Prop({ required: true })
    password: string

  @Prop({ required: true, unique: true })
    nickName: string

  @Prop({ default: Date.now })
    createdAt: Date

  @Prop({ default: Date.now })
    updatedAt: Date

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Link', unique: false })
    links: [MongooseSchema.Types.ObjectId]
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next: NextFunction) {
  const user = this

  if (!user.isModified('password')) return next()

  const newPasswordHash = HashPassword.hash(user.password)
  user.password = newPasswordHash
})

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret.__v
    delete ret._id
    delete ret.password
  }
})
