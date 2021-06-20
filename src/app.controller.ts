import { Controller, Get, NotFoundException, Param, Redirect } from '@nestjs/common'
import { UrlService } from './url/service/url.service'

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { map, switchMap, tap } from 'rxjs/operators'
import { Url } from './url/models/url.interface'
import e from 'express'
import { from, of } from 'rxjs'

@Controller()
export class AppController {

  constructor(private urlService: UrlService) {}

  @Get(':code')
  @ApiOperation({ summary: 'Redirect short url to original url' })
  @ApiResponse({ status: 302, description: 'Redirect' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Redirect('google.com', 302)
  get(@Param('code') code: string) {
    return this.urlService.findByCode(code).pipe(
      tap((existingUrl) => {
        if (!existingUrl) {
          throw new NotFoundException
        }
        this.urlService.addLinkHit(existingUrl)
      }),
      map((existingUrl) => {
        return {
          url: existingUrl.originalUrl,
          statusCode: 302,
        }
      })
    )
  }
}
