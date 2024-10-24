import {
  BusinessException,
  BusinessExceptionCode,
  ErrorDomain,
} from './exception';

export class ForbiddenException extends BusinessException {
  constructor(domain: ErrorDomain, message: string = '권한이 없습니다.') {
    super(domain, BusinessExceptionCode.FORBIDDEN, message);
  }
}
