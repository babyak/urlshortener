import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlsController } from './urls/urls.controller';

@Module({
  imports: [],
  controllers: [AppController, UrlsController],
  providers: [AppService],
})
export class AppModule {}
