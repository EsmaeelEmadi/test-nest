import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail } from 'class-validator';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ unique: true, required: true, validate: IsEmail })
  email: string;

  @Prop()
  avatar: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
