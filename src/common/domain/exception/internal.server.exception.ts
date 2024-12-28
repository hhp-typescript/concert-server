import { BusinessExceptionCode, ErrorDomain } from './error.const';
import { BusinessException } from './exception';

export class InternalServerErrorException extends BusinessException {
  constructor(domain: ErrorDomain, message?: string) {
    super(domain, BusinessExceptionCode.INTERNAL_SERVER_ERROR, message);
  }
}
