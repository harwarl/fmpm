import { Injectable } from '@nestjs/common';
import { ConfigData, ConfigDatabase } from './config.interface';
import { DEFAULT_CONFIG } from './config.default';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigService {
  private config: ConfigData;
  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      env: env['NODE_ENV'] || DEFAULT_CONFIG.env,
      port: parseInt(env['PORT']!, 10),
      db: this.parseDBConfig(env, DEFAULT_CONFIG.db),
      auth: {
        expiresIn: Number(env['TOKEN_EXPIRY']),
        access_token_secret: env['JWT_ACCESS_TOKEN_SECRET']!,
        refresh_token_secret: env['JWT_REFRESH_TOKEN_SECRET']!,
      },
      userService: {
        options: {
          url: env['USER_SERVICE_MQTT_URL']!,
        },
        transport: Transport.KAFKA,
      },
      authService: {
        options: {
          url: env['AUTH_SERVICE_MQTT_URL']!,
        },
        transport: Transport.MQTT,
      },
    };
  }

  private parseDBConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ConfigDatabase>
  ) {
    return {
      type: env['MONGO_TYPE'] || defaultConfig.type,
      host: env['MONGO_HOST'] || defaultConfig.host,
      port: Number(env['MONGO_PORT']) || defaultConfig.port,
      database: env['MONGO_DATABASE'] || defaultConfig.database,
    };
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
