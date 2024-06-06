import { DataSource } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions.js';
import { User } from '@fmpm/models';
import { ConfigService } from '@nestjs/config';

//---------------------------------- comment ----------------------------------

export const config: MongoConnectionOptions = {
  type: 'mongodb',
  host: '127.0.0.1',
  port: 27017,
  database: 'fmpm_test',
  password: '',
  entities: [User],
  useUnifiedTopology: true,
  useNewUrlParser: true,
  synchronize: false,
  logging: true,
};

export const dataSource = new DataSource(config);
