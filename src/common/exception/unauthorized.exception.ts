import {
  BusinessException,
  BusinessExceptionCode,
  ErrorDomain,
} from './exception';

export class UnauthorizedException extends BusinessException {
  constructor(domain: ErrorDomain, message: string = '인증이 필요합니다.') {
    super(domain, BusinessExceptionCode.UNAUTHORIZED, message);
  }
}
