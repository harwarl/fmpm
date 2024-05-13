import { join } from 'path';
import { DataSource } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions.js';
import { ConfigService } from '@fmpm/config';
import { User } from '@fmpm/models';

//---------------------------------- comment ----------------------------------
const configData = new ConfigService().get().db;

export const config: MongoConnectionOptions = {
  type: 'mongodb',
  host: configData.host,
  port: configData.port,
  database: configData.database,
  password: configData.password || null,
  entities: [User],
  useUnifiedTopology: true,
  useNewUrlParser: true,
  synchronize: false,
  logging: true,
};

export const dataSource = new DataSource(config);
