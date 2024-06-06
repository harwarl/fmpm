import { User } from '@fmpm/models';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get('MONGO_URL'),
        entities: [User],
        useUnifiedTopology: true,
        useNewUrlParser: true,
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
