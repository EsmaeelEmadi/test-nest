import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail } from 'class-validator';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ unique: true, required: true, validate: IsEmail })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
