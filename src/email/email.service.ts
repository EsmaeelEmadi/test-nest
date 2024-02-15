import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class EmailService {
  @EventPattern('users_queue')
  async handleUserCreated(data: any) {
    // Logic to send an email
    console.log(`Sending email to ${data.email}`);
  }
}
