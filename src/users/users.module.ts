import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
// Import the module where RABBITMQ_SERVICE is registered if it's not AppModule
import { MessagingModule } from '../messaging/messaging.module'; // Adjust the path as needed
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MessagingModule,
    EmailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

