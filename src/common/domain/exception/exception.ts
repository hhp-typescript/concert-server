import { BusinessExceptionCode, ErrorDomain } from './error.const';
import { DomainErrorMessages } from './error.message.mapper';

export class BusinessException extends Error {
  constructor(
    public readonly domain: ErrorDomain,
    public readonly code: BusinessExceptionCode,
    message?: string,
  ) {
    const inferredMessage =
      message ||
      DomainErrorMessages[domain]?.[code] ||
      '알 수 없는 오류가 발생했습니다.';
    super(inferredMessage);

    this.message = inferredMessage; // message 필드 설정
  }
}
