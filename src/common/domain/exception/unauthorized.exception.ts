import { BusinessExceptionCode, ErrorDomain } from './error.const';
import { BusinessException } from './exception';

export class UnauthorizedException extends BusinessException {
  constructor(domain: ErrorDomain, message?: string) {
    super(domain, BusinessExceptionCode.UNAUTHORIZED, message);
  }
}
