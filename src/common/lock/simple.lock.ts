// src/common/lock/simple-lock.ts
export class SimpleLock {
  private isLocked = false;

  async acquire(): Promise<void> {
    while (this.isLocked) {
      // 다른 스레드가 락을 점유 중이면 기다림
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    this.isLocked = true; // 락 획득
  }

  release(): void {
    if (this.isLocked) {
      this.isLocked = false; // 락 해제
    } else {
      throw new Error('Lock is not acquired.');
    }
  }
}
