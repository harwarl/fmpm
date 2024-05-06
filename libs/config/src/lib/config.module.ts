import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

const configFactory = {
  provide: ConfigService,
  useFactory: () => {
    const config = new ConfigService();
    config.loadFromEnv();
    return config;
  },
};
@Module({
  controllers: [],
  providers: [configFactory],
  exports: [configFactory, ConfigService],
})
export class ConfigModule {}
