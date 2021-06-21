import { Timestamp } from "rxjs";

export interface Url {
  id?: number,
  originalUrl?: string,
  code?: string,
  hits?: number,
  expiry?: Date,
  deleted?: boolean,
}