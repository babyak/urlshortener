import { Body, Controller, Delete, Get, GoneException, Header, NotFoundException, Param, Post, Query, Redirect, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { from, Observable, of } from 'rxjs'
import { Url } from '../models/url.interface'
import { SortBy, UrlService } from '../service/url.service'
import { CreateUrlDTO } from './create.url.dto'
import { SearchUrlDTO } from './searchquery.dto'
import { catchError, map, switchMap, tap, toArray } from 'rxjs/operators'

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger'

@ApiTags('Urls endpoints')
@Controller('')
export class UrlController {

  constructor(private urlService: UrlService) {}

  @Post('urls')
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

  @Get('urls')
  @ApiOperation({ summary: 'Returns paginated and filtered list of urls' })
  @ApiResponse({ status: 200, description: 'Redirect' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @UseGuards(AuthGuard('Api-Key'))
  @ApiQuery({ name: 'limit' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'keywordUrl', required: false })
  @ApiQuery({ name: 'keywordCode', required: false })
  @ApiQuery({ name: 'sortBy', enum: SortBy, required: false })
  get(
    @Query() query?: SearchUrlDTO
  ): any {
    console.log(this.urlService.findAndCount(query))
    return this.urlService.findAndCount(query)
  }

  @Get(':code')
  @ApiOperation({ summary: 'Redirect short url to original url' })
  @ApiResponse({ status: 302, description: 'Redirect' })
  @ApiResponse({ status: 410, description: 'Expired or Deleted' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Redirect('google.com', 302)
  getRedirect(@Param('code') code: string) {
    return this.urlService.findByCode(code).pipe(
      tap((existingUrl) => {
        if (!existingUrl) {
          throw new NotFoundException
        }
        if (existingUrl.deleted || existingUrl.expiry.getTime() < Date.now()) {
          throw new GoneException
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

  @Delete('urls/:id')
  @ApiOperation({ summary: 'Create and return short URL' })
  @ApiResponse({ status: 204, description: 'Successful delete' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @UseGuards(AuthGuard('Api-Key'))
  delete(@Param('id') id: number) {
    return this.urlService.delete(id)
  }
}

