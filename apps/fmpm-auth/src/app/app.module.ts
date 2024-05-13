import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../ormConfig';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@fmpm/config';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';

const authConfig = new ConfigService().get().auth;
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    JwtModule.register({
      signOptions: { expiresIn: authConfig.expiresIn },
      secret: authConfig.access_token_secret,
    }),
    UserModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
