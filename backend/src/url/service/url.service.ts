import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UrlEntity } from '../models/url.entity'
import { Repository, Like } from 'typeorm'
import { Url } from '../models/url.interface'
import { Observable, from, of, forkJoin } from 'rxjs'
import { nanoid } from 'nanoid'
import { getDefaultExpiryDate } from 'src/utils/date'
import { merge } from 'rxjs/operators'
import { query } from 'express'
import { SearchUrlDTO } from '../controller/searchquery.dto'


export enum SortBy {
  hits = 'hits',
  expiry = 'expiry',
  id = "id"
}

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
        where: {originalUrl: url }
      }))
    }

    findAndCount(searchQuery: SearchUrlDTO): Observable<any> {
      const query = this.urlRepository.createQueryBuilder('url')
        .select(['url.originalUrl', 'url.code', 'url.expiry', 'url.hits'])
        .where(
          { originalUrl: Like('%' + searchQuery.keywordUrl + '%') },
          { code: Like('%' + searchQuery.keywordCode + '%') },
        )
        .orderBy({ [searchQuery.sortBy] : "DESC"})
        .skip(searchQuery.page * searchQuery.limit)
        .take(searchQuery.limit)

      return forkJoin({
        count: query.getCount(),
        urls: query.getMany(),
      })
    }

    addLinkHit(url: Url) {
      this.urlRepository.createQueryBuilder()
        .update(url)
        .set({ hits: () => 'hits + 1' })
        .execute()
    }

    delete(id: number) {
      return this.urlRepository.createQueryBuilder()
        .update()
        .set({deleted: true})
        .where("id = :id", { id })
        .execute()
    }

    updateUrlExpiry(url: Url, expiryDate?: Date) : Observable<Url> {
      const newExpiryDate = expiryDate ? expiryDate : getDefaultExpiryDate()
      this.urlRepository.createQueryBuilder()
        .update(url)
        .set({ expiry: newExpiryDate })
        .execute()

      return from(this.urlRepository.findOne({where :{ id: url.id}}))
    }
  }
