
import { IsString, IsDate, IsNotEmpty, IsUrl, IsOptional, IsInt, IsEnum} from 'class-validator';
import { ApiProperty, ApiQuery } from '@nestjs/swagger'
import { Url } from '../models/url.interface';
import { Exclude, Type } from 'class-transformer';
import { SortBy, SortOrder } from '../service/url.service';
import { Optional } from '@nestjs/common';


export class SearchUrlDTO {

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  readonly _start: number


  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  readonly _end: number

  @IsString()
  @Optional()
  @IsOptional()
  readonly keywordUrl?: string = ''

  @IsString()
  @Optional()
  @IsOptional()
  readonly keywordCode?: string = ''

  @IsString()
  @Optional()
  @IsOptional()
  @IsEnum(SortBy)
  readonly _sort?: SortBy = SortBy.id

  @IsString()
  @Optional()
  @IsOptional()
  @IsEnum(SortOrder)
  readonly _order?: SortOrder = SortOrder.ASC
}