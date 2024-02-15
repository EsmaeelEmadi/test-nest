
// import { Injectable } from '@nestjs/common';
// import { EventPattern } from '@nestjs/microservices';

// @Injectable()
// export class EmailService {
//   @EventPattern('')
//   async handleUserCreated(data: any) {
//     console.log(`Sending email to ${data.email}`);
//   }
// }
 
 // src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  @EventPattern('*') // Listen to all messages for debugging purposes
  async handleAnyMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log("--------------------")
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.debug(`Received message: ${JSON.stringify(data)}`);
    channel.ack(originalMsg); // Acknowledge the message if needed
  }
}