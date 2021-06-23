import { Body, CACHE_MANAGER, Controller, Delete, Get, GoneException, Inject, NotFoundException, Param, Post, Query, Redirect, UsePipes, ValidationPipe, Response, UseGuards } from '@nestjs/common'
import { from, Observable, of } from 'rxjs'
import { Url } from '../models/url.interface'
import { SortOrder, SortBy, UrlService } from '../service/url.service'
import { CreateUrlDTO } from './create.url.dto'
import { SearchUrlDTO } from './searchquery.dto'
import { map, switchMap, tap, } from 'rxjs/operators'
import { Cache } from 'cache-manager';
import { Response as Res } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'
import { UrlEntity } from '../models/url.entity'
import { AuthGuard } from '@nestjs/passport'

@ApiTags('Urls endpoints')
@Controller('')
export class UrlController {

  constructor(private urlService: UrlService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

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
  @UseGuards(AuthGuard('Api-Key'))
  @ApiQuery({ name: '_end' })
  @ApiQuery({ name: '_start' })
  @ApiQuery({ name: 'keywordUrl', required: false })
  @ApiQuery({ name: 'keywordCode', required: false })
  @ApiQuery({ name: '_order', enum: SortOrder, required: false })
  @ApiQuery({ name: '_sort', enum: SortBy, required: false })
  async get(
    @Response() res: Res, @Query() query?: SearchUrlDTO
  ): Promise<any> {
    const result = await this.urlService.findAndCount(query).toPromise()
    res.header('Access-Control-Expose-Headers', 'X-Total-Count')
    return res.set({'X-Total-Count' : result.count}).json(result.urls)
  }

  @Get(':code')
  @ApiOperation({ summary: 'Redirect short url to original url' })
  @ApiResponse({ status: 302, description: 'Redirect' })
  @ApiResponse({ status: 410, description: 'Expired or Deleted' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Redirect('google.com', 302)
  getRedirect(@Param('code') code: string) {
    //@todo move cache manger into url service instead having it here in controller
    return from(this.cacheManager.get(code)).pipe(
      switchMap((urlFromCacheJSON: string) => {
        const urlFromCache = plainToClass(UrlEntity, JSON.parse(urlFromCacheJSON))
        if (urlFromCache) {
          return of(urlFromCache)
        }
        return this.urlService.findByCode(code).pipe(
          map((url: Url) => url))
      }),
      tap((url: Url) => {
        if (!url) {
          throw new NotFoundException
        }
        if (url.deleted === true || url.expiry.getTime() < Date.now()) {
          console.log(url)
          throw new GoneException
        }
        //@todo limit redis url entries and replace popular with less popular urls
        this.cacheManager.set(code, JSON.stringify(url))
        this.urlService.addLinkHit(url)
      }),
      map((url: Url) => {
        return {
          url: url.originalUrl,
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
  @UseGuards(AuthGuard('Api-Key'))
  delete(@Param('id') id: number) {
    return this.urlService.delete(id)
  }
}

