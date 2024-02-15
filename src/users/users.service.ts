import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

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

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}

