import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true, unique: true })
  nickname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;
    delete ret.password;
  },
});
