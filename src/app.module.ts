import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE', // Arbitrary name for the microservice client
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // RabbitMQ server URL
          queue: 'emailQueue', // Queue name
          queueOptions: {
            durable: false
          },
        },
      },
    ]),

    MongooseModule.forRoot(process.env.MONGODB_URI, {}),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
