import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';

export default function typeOrmConfig(configService: ConfigService) {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [User],
    synchronize: true,
  } as TypeOrmModuleAsyncOptions;
}
