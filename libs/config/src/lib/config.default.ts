import { ConfigData } from './config.interface';
import { Transport } from '@nestjs/microservices';

export const DEFAULT_CONFIG: ConfigData = {
  port: Number(process.env['PORT']) || 3001,
  env: 'production',
  db: {
    type: 'mongodb',
    host: 'localhost',
    port: Number('27017'),
    database: 'fmpm_test',
  },
  swagger: {
    username: '',
    password: '',
  },
  auth: {
    expiresIn: 30000,
    access_token_secret: '',
    refresh_token_secret: '',
  },
  userService: {
    options: {
      url: 'mqtt://localhost:1883',
    },
    transport: Transport.MQTT,
  },
  authService: {
    options: {
      url: 'mqtt://localhost:1883',
    },
    transport: Transport.MQTT,
  },
};
