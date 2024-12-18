/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { VideoSchema } from './database/schemas/video';
import { Stream, StreamSchema } from './database/schemas/stream';
import { Account, AccountSchema } from './database/schemas/account';
import { MailWorker } from './worker/mail';
import { MainGateway } from './socket/main.gateway';
import { Video } from './database/schemas/video';
import { Channel, ChannelSchema } from './database/schemas/channel';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        username: process.env.REDIS_USERNAME,
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        connectTimeout: 10000,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        tls: {}
      }
    }),
    BullModule.registerQueue({ name: 'MailWorker' }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: Stream.name, schema: StreamSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Video.name, schema: VideoSchema },
      { name: Channel.name, schema: ChannelSchema },
    ])
  ],
  controllers: [AppController],
  providers: [AppService, MailWorker, MainGateway],
})
export class AppModule { }
