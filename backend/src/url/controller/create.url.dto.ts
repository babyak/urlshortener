
import { IsString, IsDate, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { Url } from '../models/url.interface';
import { Exclude } from 'class-transformer';

export class CreateUrlDTO implements Url {

  @Exclude()
  id: number

  @Exclude()
  hits: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  readonly originalUrl: string

  @Exclude()
  readonly code: string

  @ApiProperty()
  @IsDate()
  @IsOptional()
  readonly expiry: Date
}