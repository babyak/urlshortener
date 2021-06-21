import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UrlEntity } from '../models/url.entity'
import { Repository, Like } from 'typeorm'
import { Url } from '../models/url.interface'
import { Observable, from } from 'rxjs'
import { nanoid } from 'nanoid'
import { getDefaultExpiryDate } from 'src/utils/date'

export enum SortBy {
  hits = 'hits',
  expiry = 'expiry',
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

    findAndCount(page: number, limit: number, sortBy: SortBy, keyword: string): Observable<[Url[], number]> {
      return from(
        this.urlRepository.findAndCount({
          where: { code: Like('%' + keyword + '%') },
          // order: { `${sortBy}` : "DESC"},
          take: limit,
          skip: page
        })
      )
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
      console.log('fuck')
      console.log(this.urlRepository.findOne({where :{ id: url.id}}))
      return from(this.urlRepository.findOne({where :{ id: url.id}}))
    }
  }
