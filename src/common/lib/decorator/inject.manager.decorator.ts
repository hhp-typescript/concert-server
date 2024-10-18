import { BaseRepository } from 'src/common/repository/base-repository';

export function InjectTransactionManager(targetNames: string[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const queryRunner = this.queryRunner;

      if (!queryRunner) {
        throw new Error('QueryRunner is not available.');
      }

      if (this.constructor.name.includes('Facade')) {
        const transactionServices = {};
        for (const key of targetNames) {
          this[key].queryRunner = queryRunner;
        }

        return originalMethod.apply({ ...this, ...transactionServices }, args);
      }

      if (this.constructor.name.includes('Service')) {
        const transactionRepos = {};
        for (const key of targetNames) {
          if (this[key] instanceof BaseRepository) {
            transactionRepos[key] = this[key].createTransactionRepo(
              queryRunner.manager,
            );
          }
        }

        return originalMethod.apply({ ...this, ...transactionRepos }, args);
      }
    };

    return descriptor;
  };
}
