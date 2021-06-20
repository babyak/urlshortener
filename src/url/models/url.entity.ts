import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UrlEntity {

  @PrimaryGeneratedColumn ()
  id: number

  @Column({ unique:true })
  originalUrl: string

  @Column({ unique:true })
  code: string

  @Column()
  hits: number

  @Column()
  expiry: Date

  @Column()
  deleted: boolean
}