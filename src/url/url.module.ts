import { Module } from '@nestjs/common';
import { UrlService } from './service/url.service';
import { UrlController } from './controller/url.controller';
import { UrlEntity } from './models/url.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlEntity]),
    AuthModule
  ],
  providers: [UrlService],
  controllers: [UrlController]
})
export class UrlModule {}
