import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UrlEntity } from '../models/url.entity'
import { Repository, Like } from 'typeorm'
import { Url } from '../models/url.interface'
import { Observable, from } from 'rxjs'
import { nanoid } from 'nanoid'

@Injectable()
export class UrlService {

  constructor(
    @InjectRepository(UrlEntity) private readonly urlRepository: Repository<UrlEntity>
    ) {}

    create(url: Url): Observable<Url> {
      url.code = nanoid(6)
      return from(
        this.urlRepository.save(url)
      )
    }

    findByCode(code: string): Observable<Url> {
      return from(this.urlRepository.findOne({
        where: {code: code}
      }))
    }

    findByUrl(url: string): Observable<Url> {
      return from(this.urlRepository.findOne({
        where: {originalUrl: url}
      }))
    }

    findByKeyword( keyword: string ) : Observable<Url[]> {
      return from(this.urlRepository.find({
          where: { originalUrl:  Like('%' +  keyword + '%') }
        }
      ))
    }

    findByPageAndLimit(page: number, limit: number): Observable<Url[]> {
      return from(this.urlRepository.find({
        skip: page,
        take: limit,
      }))
    }

    addLinkHit(url: Url) {
      this.urlRepository.createQueryBuilder()
        .update(url)
        .set({ hits: () => 'hits + 1' })
        .execute()
    }
  }
