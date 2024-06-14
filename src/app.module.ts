import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './message/message.module';
import { AppGateway } from './app/app.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat'),
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
