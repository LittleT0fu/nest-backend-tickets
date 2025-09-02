import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';;
import { MongooseModule } from '@nestjs/mongoose';
import { ConcertsModule } from './concerts/concerts.module';


@Module({
imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ConcertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
