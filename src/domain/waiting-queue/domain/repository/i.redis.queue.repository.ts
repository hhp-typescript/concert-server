export interface IRedisQueueRepository {
  issueToken(concertDateId: number): Promise<string>;
  getWaitingTokenRank(
    concertDateId: number,
    token: string,
  ): Promise<number | null>;
  activateTokens(concertDateId: number, count: number): Promise<void>;
  isTokenActive(concertDateId: number, token: string): Promise<boolean>;
  deleteToken(concertDateId: number, token: string): Promise<void>;
}
