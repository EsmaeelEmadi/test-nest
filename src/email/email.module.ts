import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MessagingModule } from '../messaging/messaging.module'; // Adjust the import path as needed

@Module({
  imports: [MessagingModule], // Import MessagingModule to use RabbitMQ client
  providers: [EmailService], // Register EmailService
})
export class EmailModule {}