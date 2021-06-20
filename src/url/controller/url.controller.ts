import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { from, Observable, of } from 'rxjs'
import { Url } from '../models/url.interface'
import { UrlService } from '../service/url.service'
import { CreateUrlDTO } from './create.url.dto'
import { catchError, map, switchMap, toArray } from 'rxjs/operators';


import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'


@ApiTags('url')
@Controller('url')
export class UrlController {

  constructor(private urlService: UrlService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create and return short URL' })
  @ApiResponse({ status: 200, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  create(@Body() url: CreateUrlDTO): Observable<Url> {
    return from(this.urlService.findByUrl(url.originalUrl).pipe(
      switchMap((existingUrl: Url) => {
        if(existingUrl) {
          return of(existingUrl)
        }
        return this.urlService.create(url)
      }))
    )
  }
}
