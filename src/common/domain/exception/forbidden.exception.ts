import { BusinessExceptionCode, ErrorDomain } from './error.const';
import { BusinessException } from './exception';

export class ForbiddenException extends BusinessException {
  constructor(domain: ErrorDomain, message?: string) {
    super(domain, BusinessExceptionCode.FORBIDDEN, message);
  }
}
