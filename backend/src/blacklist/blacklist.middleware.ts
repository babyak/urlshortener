import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const REGEX_BLACKLIST: RegExp[] = [/string.com/];

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isBlacklisted = REGEX_BLACKLIST.some((rx) =>
      rx.test(req.body.originalUrl),
    );
    if (isBlacklisted) {
      throw new BadRequestException(['This Url is blacklisted']);
    }
    next();
  }
}
