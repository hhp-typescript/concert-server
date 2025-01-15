import { BusinessExceptionCode, ErrorDomain } from './error.const';

export const DomainErrorMessages: Record<
  ErrorDomain,
  Partial<Record<BusinessExceptionCode, string>>
> = {
  user: {
    [BusinessExceptionCode.BAD_REQUEST]: '잘못된 사용자 요청입니다.',
    [BusinessExceptionCode.FORBIDDEN]: '사용자 접근이 금지되었습니다.',
    [BusinessExceptionCode.UNAUTHORIZED]: '사용자 인증이 필요합니다.',
    [BusinessExceptionCode.NOT_FOUND]: '사용자를 찾을 수 없습니다.',
    [BusinessExceptionCode.CONFLICT]: '이미 존재하는 사용자입니다.',
    [BusinessExceptionCode.INTERNAL_SERVER_ERROR]:
      '사용자 처리 중 서버 오류가 발생했습니다.',
  },
  concert: {
    [BusinessExceptionCode.BAD_REQUEST]: '잘못된 공연 요청입니다.',
    [BusinessExceptionCode.FORBIDDEN]: '공연 접근이 금지되었습니다.',
    [BusinessExceptionCode.UNAUTHORIZED]: '인증이 필요합니다.',
    [BusinessExceptionCode.NOT_FOUND]:
      '예약 가능한 공연/좌석이 존재하지 않습니다',
    [BusinessExceptionCode.CONFLICT]: '충돌이 발생했습니다.',
    [BusinessExceptionCode.INTERNAL_SERVER_ERROR]:
      '공연 처리 중 서버 오류가 발생했습니다.',
  },
  payment: {
    [BusinessExceptionCode.BAD_REQUEST]: '잘못된 결제 요청입니다.',
    [BusinessExceptionCode.FORBIDDEN]: '결제 접근이 금지되었습니다.',
    [BusinessExceptionCode.UNAUTHORIZED]: '결제 인증이 필요합니다.',
    [BusinessExceptionCode.NOT_FOUND]: '결제 정보를 찾을 수 없습니다.',
    [BusinessExceptionCode.CONFLICT]: '이미 결제 완료된 예약입니다.',
    [BusinessExceptionCode.INTERNAL_SERVER_ERROR]:
      '결제 처리 중 서버 오류가 발생했습니다.',
  },
  'waiting-queue': {
    [BusinessExceptionCode.BAD_REQUEST]: '잘못된 대기열 요청입니다.',
    [BusinessExceptionCode.FORBIDDEN]: '대기열 접근이 금지되었습니다.',
    [BusinessExceptionCode.UNAUTHORIZED]: '대기열 인증이 필요합니다.',
    [BusinessExceptionCode.NOT_FOUND]: '대기열에 정보가 존재하지 않습니다.',
    [BusinessExceptionCode.CONFLICT]: '이미 대기열에 등록되어 있습니다.',
    [BusinessExceptionCode.INTERNAL_SERVER_ERROR]:
      '대기열 처리 중 서버 오류가 발생했습니다.',
  },
  reservation: {
    [BusinessExceptionCode.BAD_REQUEST]: '잘못된 요청입니다.',
    [BusinessExceptionCode.FORBIDDEN]: '해당 예약의 접근이 금지되었습니다.',
    [BusinessExceptionCode.UNAUTHORIZED]: '인증이 필요합니다.',
    [BusinessExceptionCode.NOT_FOUND]: '예약 정보를 찾을 수 없습니다.',
    [BusinessExceptionCode.CONFLICT]: '이미 예약 되었습니다.',
    [BusinessExceptionCode.INTERNAL_SERVER_ERROR]:
      '예약 처리 중 서버 오류가 발생했습니다.',
  },
};
