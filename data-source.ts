import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Загружаем .env переменные

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'nest_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // В продакшне ВСЕГДА false
});