import { Transport } from '@nestjs/microservices';

export interface ConfigDatabase {
  type: string;
  host: string;
  port: number;
  database: string;
  password: string;
}

export interface AuthConfig {
  expiresIn: number;
  access_token_secret: string;
  refresh_token_secret: string;
}

export interface UserServiceConfig {
  options: UserServiceConfigOptions;
  transport: Transport;
}

export interface UserServiceConfigOptions {
  url: string;
}

export interface SwaggerConfigOptions {
  username: string;
  password: string;
}

export interface ConfigData {
  env: string;
  port: number;
  db: ConfigDatabase;
  swagger: SwaggerConfigOptions;
  auth: AuthConfig;
  userService?: UserServiceConfig;
  tokenService?: UserServiceConfig;
  authService?: UserServiceConfig;
  redisService?: UserServiceConfig;
  rmqService?: UserServiceConfig;
}
