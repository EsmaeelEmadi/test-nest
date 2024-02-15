import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/exceptions';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // Your RabbitMQ server URL
      queue: 'emailQueue', // Make sure this matches the queue used in UserService
      queueOptions: {
        durable: false,
      },
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen();
}
bootstrap();


