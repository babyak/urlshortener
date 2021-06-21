import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UrlService, SortBy } from 'src/url/service/url.service';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Observable } from 'rxjs';
import { Url } from 'src/url/models/url.interface';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private urlService: UrlService) {}

  @Get()
  @ApiOperation({ summary: 'Returns paginated and filtered list of urls' })
  @ApiResponse({ status: 200, description: 'Redirect' })
  @UseGuards(AuthGuard('api-key'))
  get(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('keyword') keyword: string,
    @Param('sortBy') sortBy: SortBy
  ): Observable<[Url[], number]> {
    return this.urlService.findAndCount(page, limit, sortBy, keyword)
  }
}
