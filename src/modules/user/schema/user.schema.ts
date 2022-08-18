import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
    email: string

  @Prop({ required: true })
    password: string

  @Prop()
    fullName: string

  @Prop()
    bio:string

  @Prop({ required: false, unique: false })
    avatar_url: string

  @Prop({ required: false, unique: false })
    avatar_public_id: string

  @Prop({ required: true, unique: true })
    nickName: string

  @Prop({ default: Date.now })
    createdAt: Date

  @Prop({ default: Date.now })
    updatedAt: Date

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Link', unique: false })
    principalAccount: MongooseSchema.Types.ObjectId

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Link', unique: false })
    links: [MongooseSchema.Types.ObjectId]
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
