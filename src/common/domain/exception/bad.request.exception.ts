import { BusinessExceptionCode, ErrorDomain } from './error.const';
import { BusinessException } from './exception';

export class BadRequestException extends BusinessException {
  constructor(domain: ErrorDomain, message?: string) {
    super(domain, BusinessExceptionCode.BAD_REQUEST, message);
  }
}
