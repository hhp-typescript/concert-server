import {
  BusinessException,
  BusinessExceptionCode,
  ErrorDomain,
} from './exception';

export class InternalServerErrorException extends BusinessException {
  constructor(
    domain: ErrorDomain,
    message: string = '내부 서버 오류가 발생했습니다.',
  ) {
    super(domain, BusinessExceptionCode.INTERNAL_SERVER_ERROR, message);
  }
}
