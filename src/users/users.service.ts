import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    @InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      await createdUser.save();
      this.client.emit<any>('userCreated', { email: createdUser.email });
      return createdUser;
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key error
        throw new Error('User with this name or email already exists');
      }
      // Handle other errors, possibly validation errors
      throw error;
    }
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findUserById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserAvatar(userId: string): Promise<{ avatarPath: string }> {
    const user = await this.findUserById(userId); // Reuse the findUserById method
    if (user.avatar) {
      return { avatarPath: path.join(process.cwd(), 'uploads', user.avatar) };
    }
    throw new NotFoundException('Avatar not found');
  }

  async deleteUserAvatar(userId: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user.avatar) {
      const avatarPath = path.join(process.cwd(), 'uploads', user.avatar);
      fs.unlink(avatarPath, (err) => {
        if (err) throw new NotFoundException('Avatar not found or already deleted');
      });
      user.avatar = undefined;
      await user.save();
    } else {
      throw new NotFoundException('Avatar not found');
    }
  }
}

