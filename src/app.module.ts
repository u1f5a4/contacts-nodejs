import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import typeormConfig from './database/typeorm.config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormConfig(configService),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/images',
      rootPath: 'images',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
