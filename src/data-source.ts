import 'reflect-metadata';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserPersistenceEntity } from './infrastructure/persistence/entities/user.persistence.entity';
import { CreateUsersTable1700000000001 } from './database/migrations/1700000000001-CreateUsersTable';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'reservation_system',
  entities: [UserPersistenceEntity],
  migrations: [CreateUsersTable1700000000001],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
};

export const AppDataSource = new DataSource(config);
