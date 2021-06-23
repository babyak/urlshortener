
import { IsString, IsDate, IsNotEmpty, IsUrl, IsOptional, IsInt, IsEnum} from 'class-validator';
import { ApiProperty, ApiQuery } from '@nestjs/swagger'
import { Url } from '../models/url.interface';
import { Exclude, Type } from 'class-transformer';
import { SortBy } from '../service/url.service';
import { Optional } from '@nestjs/common';


export class SearchUrlDTO {

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  readonly page: number


  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  readonly limit: number

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
  readonly sortBy?: SortBy = SortBy.id
}