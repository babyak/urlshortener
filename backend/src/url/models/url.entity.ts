import { url } from 'inspector'
import { getDefaultExpiryDate } from 'src/utils/date'
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { nanoid } from 'nanoid'
import { Type } from 'class-transformer'

@Entity()
export class UrlEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique:true, name: 'originalurl' })
  originalUrl: string

  @Column({ unique:true })
  code: string

  @Column({default: 0})
  hits: number

  @Column()
  @Type(() => Date)
  expiry: Date

  @Column({default: false})
  deleted: boolean

  @BeforeInsert()
  async setDefaultExpiry() {
    return this.expiry = this.expiry ? this.expiry : getDefaultExpiryDate()
  }

  @BeforeInsert()
  async generateShortUrl() {
    return this.code = nanoid(6)
  }
}