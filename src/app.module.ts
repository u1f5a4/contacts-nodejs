import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import typeormConfig from './database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    ServeStaticModule.forRoot({
      serveRoot: '/images',
      rootPath: 'images',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
