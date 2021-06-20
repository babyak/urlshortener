import { getDefaultExpiryDate } from 'src/utils/date'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class UrlEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique:true })
  originalUrl: string

  @Column({ unique:true })
  code: string

  @Column({default: 0})
  hits: number

  @Column({default: getDefaultExpiryDate()})
  expiry: Date

  @Column({default: false})
  deleted: boolean
}