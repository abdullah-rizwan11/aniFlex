import { registerAs } from '@nestjs/config';
import User from 'src/user/user.entity';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 35432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],
  migrationsTableName: 'migrations',
}));
