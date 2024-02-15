import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class EmailService {
  @EventPattern('userCreated')
  async handleUserCreated(data: any) {
    // Logic to send an email
    console.log(`Sending email to ${data.email}`);
  }
}
