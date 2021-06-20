import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Url } from '../models/url.interface';
import { UrlService } from '../service/url.service';

@Controller('url')
export class UrlController {

    constructor(private urlService: UrlService) {}

    @Post()
    create(@Body()url: Url): Observable<Url> {
        return this.urlService.create(url)
    }
}
