import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Url } from '../models/url.interface';
import { Exclude, Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class CreateUrlDTO implements Url {
  @Exclude()
  id: number;

  @Exclude()
  hits: number;

  @Exclude()
  readonly code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  readonly originalUrl: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Optional()
  readonly expiry?: Date;
}
