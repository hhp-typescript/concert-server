import { HttpStatus } from '@nestjs/common';
import { BusinessExceptionCode } from 'src/common/domain/exception/error.const';

// BusinessExceptionCode와 HTTP 상태 코드를 매핑
export const HttpStatusMap: Record<BusinessExceptionCode, HttpStatus> = {
  [BusinessExceptionCode.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
  [BusinessExceptionCode.FORBIDDEN]: HttpStatus.FORBIDDEN,
  [BusinessExceptionCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [BusinessExceptionCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [BusinessExceptionCode.CONFLICT]: HttpStatus.CONFLICT,
  [BusinessExceptionCode.INTERNAL_SERVER_ERROR]:
    HttpStatus.INTERNAL_SERVER_ERROR,
} as const;
