// src/common/lock/spin-lock.ts
export class SpinLock {
  private isLocked = false;

  acquire(): void {
    while (this.isLocked) {
      // 락이 해제될 때까지 계속 시도
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
