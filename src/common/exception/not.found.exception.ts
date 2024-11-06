import {
  BusinessException,
  BusinessExceptionCode,
  ErrorDomain,
} from './exception';

export class NotFoundException extends BusinessException {
  constructor(
    domain: ErrorDomain,
    message: string = '리소스를 찾을 수 없습니다.',
  ) {
    super(domain, BusinessExceptionCode.NOT_FOUND, message);
  }
}

//TODO controller exception을 mapper이용
