import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlModule } from './url/url.module';
import { UrlService } from './url/service/url.service';
import { UrlEntity } from './url/models/url.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: ['./dist/url/models/*entity.js'],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UrlEntity]),
    UrlModule,
  ],
  providers: [UrlService],
  controllers: [AppController],
})

export class AppModule {}
