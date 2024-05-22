import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEDATABASE1716363203171 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "user" (
            "id" SERIAL PRIMARY KEY,
            "fullname" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL UNIQUE,
            "password" VARCHAR(255) NOT NULL,
            "resetLink" VARCHAR(255));`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
