import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { RateModule } from '../rate/rate.module';

@Module({
  imports: [AuthModule, RateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
