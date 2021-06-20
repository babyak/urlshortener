import { Module } from '@nestjs/common';
import { UrlService } from './service/url.service';
import { UrlController } from './controller/url.controller';
import { UrlEntity } from './models/url.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlEntity])
  ],
  providers: [UrlService],
  controllers: [UrlController]
})
export class UrlModule {}
