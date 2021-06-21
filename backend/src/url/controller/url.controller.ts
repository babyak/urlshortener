import { Body, Controller, Delete, Get, Header, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { from, Observable, of } from 'rxjs'
import { Url } from '../models/url.interface'
import { SortBy, UrlService } from '../service/url.service'
import { CreateUrlDTO } from './create.url.dto'
import { catchError, map, switchMap, toArray } from 'rxjs/operators'
import { AuthGuard } from '@nestjs/passport'

import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'


@ApiTags('Urls endpoints')
@Controller('urls')
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
          return this.urlService.updateUrlExpiry(existingUrl, url.expiry)
        }
        return this.urlService.create(url)
      }))
    )
  }

  @Get()
  @ApiOperation({ summary: 'Returns paginated and filtered list of urls' })
  @ApiResponse({ status: 200, description: 'Redirect' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @UseGuards(AuthGuard('Api-Key'))
  get(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('keyword') keyword: string,
    @Param('sortBy') sortBy: SortBy,
  ): Observable<[Url[], number]> {
    return this.urlService.findAndCount(page, limit, sortBy, keyword)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Create and return short URL' })
  @ApiResponse({ status: 204, description: 'Successful delete' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @UseGuards(AuthGuard('Api-Key'))
  delete(@Param('id') id: number) {
    return this.urlService.delete(id)
  }
}

