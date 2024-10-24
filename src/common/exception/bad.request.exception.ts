import {
  BusinessException,
  BusinessExceptionCode,
  ErrorDomain,
} from './exception';

export class BadRequestException extends BusinessException {
  constructor(domain: ErrorDomain, message: string = '잘못된 요청입니다.') {
    super(domain, BusinessExceptionCode.BAD_REQUEST, message);
  }
}
