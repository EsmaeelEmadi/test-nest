import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { EmailService } from './email/email.service';
import { MessagingModule } from './messaging/messaging.module';
import { EmailModule } from './email/email.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {}),
    UsersModule,
    MessagingModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}