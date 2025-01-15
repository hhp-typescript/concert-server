import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class BaseRepository<Entity> extends Repository<Entity> {
  constructor(
    readonly targetEntity: EntityTarget<Entity>,
    readonly manager: EntityManager,
  ) {
    super(targetEntity, manager);
  }

  /**
   * queryRunner.manager를 주입받아 트랜잭션에 사용할 새로운 Repository 생성 리턴한다.
   * @param manager - queryRunner.manager
   * @Url [ github | Repository#extend()](https://github.com/typeorm/typeorm/blob/master/src/repository/Repository.ts#L697C5-L697C11) 와 동일한 역할 수행
   * @Url [typeorm 공식문서](https://typeorm.io/custom-repository#how-to-create-custom-repository)
   */
  createTransactionRepo(manager: EntityManager): this {
    const constructor = this.constructor;
    const transactionId = uuidv4();
    if ((manager as any).id) {
      console.log('if', (manager as any).id);
    }
    (manager as any).id = transactionId;
    console.log('baseRepo:', (manager as any).id);
    if (!manager.queryRunner) {
      throw new Error('EntityManager does not have queryRunner.');
    }
    if (constructor.name === 'BaseRepository') {
      throw new Error('Instance is not CustomRepository child.');
    }
    return new (constructor as any)(manager);
  }
}
