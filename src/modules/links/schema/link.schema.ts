import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { User } from '../../user/schema/user.schema'

@Schema()
export class Link extends Document {
    @Prop()
      titleLink: string

    @Prop()
      link: string

    @Prop()
      socialName: string

    @Prop()
      socialIcon: string

    @Prop({ default: Date.now })
      createdAt: Date

    @Prop({ default: Date.now })
      updatedAt: Date

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, unique: false })
      user: MongooseSchema.Types.ObjectId
}

export const LinkSchema = SchemaFactory.createForClass(Link)

LinkSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret.__v
    delete ret._id
  }
})
