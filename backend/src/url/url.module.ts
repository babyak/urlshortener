import { CacheModule, Module } from '@nestjs/common';
import { UrlService } from './service/url.service';
import { UrlController } from './controller/url.controller';
import { UrlEntity } from './models/url.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlEntity]),
    AuthModule,
    CacheModule.register({
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
  ],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
