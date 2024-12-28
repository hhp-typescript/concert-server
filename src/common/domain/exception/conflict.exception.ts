import { BusinessExceptionCode, ErrorDomain } from './error.const';
import { BusinessException } from './exception';

export class ConflictException extends BusinessException {
  constructor(domain: ErrorDomain, message?: string) {
    super(domain, BusinessExceptionCode.CONFLICT, message);
  }
}
