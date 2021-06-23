import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlModule } from './url/url.module';
import { UrlService } from './url/service/url.service';
import { UrlEntity } from './url/models/url.entity';
import { ConfigModule } from '@nestjs/config';
import { BlacklistMiddleware } from './blacklist/blacklist.middleware';

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
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BlacklistMiddleware)
      .forRoutes({ path: 'urls', method: RequestMethod.POST })
  }
}
