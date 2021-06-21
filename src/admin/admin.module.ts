import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from 'src/url/models/url.entity';
import { UrlService } from 'src/url/service/url.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlEntity]),
    AuthModule
  ],
  providers: [UrlService],
  controllers: [AdminController]
})
export class AdminModule {}
