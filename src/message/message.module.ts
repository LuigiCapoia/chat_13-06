import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])
  ],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}
