export type ErrorDomain =
  | 'user'
  | 'concert'
  | 'payment'
  | 'waiting-queue'
  | 'reservation';

export enum BusinessExceptionCode {
  BAD_REQUEST = 'BAD_REQUEST',
  FORBIDDEN = 'FORBIDDEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT ',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}
