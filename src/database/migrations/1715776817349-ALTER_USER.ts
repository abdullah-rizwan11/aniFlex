import { MigrationInterface, QueryRunner } from "typeorm";

export class ALTERUSER1715776817349 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ADD COLUMN "address" VARCHAR(20)  -- fast and safe')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE ')
    }

}
