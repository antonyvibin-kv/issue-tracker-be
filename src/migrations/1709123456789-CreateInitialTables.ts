import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1709123456789 implements MigrationInterface {
  name = 'CreateInitialTables1709123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'developer',
        "slackUserId" character varying,
        "slackWorkspaceId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "issue" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "status" character varying NOT NULL DEFAULT 'open',
        "priority" character varying NOT NULL DEFAULT 'medium',
        "assigneeId" uuid,
        "reporterId" uuid NOT NULL,
        "isPoked" boolean NOT NULL DEFAULT false,
        "lastPokedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_issue" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "issue_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "issueId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "oldStatus" character varying,
        "newStatus" character varying,
        "comment" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_issue_history" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "slack_thread" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "issueId" uuid NOT NULL,
        "channelId" character varying NOT NULL,
        "threadTs" character varying NOT NULL,
        "messageTs" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_slack_thread" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "issue"
      ADD CONSTRAINT "FK_issue_assignee"
      FOREIGN KEY ("assigneeId")
      REFERENCES "user"("id")
      ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "issue"
      ADD CONSTRAINT "FK_issue_reporter"
      FOREIGN KEY ("reporterId")
      REFERENCES "user"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "issue_history"
      ADD CONSTRAINT "FK_issue_history_issue"
      FOREIGN KEY ("issueId")
      REFERENCES "issue"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "issue_history"
      ADD CONSTRAINT "FK_issue_history_user"
      FOREIGN KEY ("userId")
      REFERENCES "user"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "slack_thread"
      ADD CONSTRAINT "FK_slack_thread_issue"
      FOREIGN KEY ("issueId")
      REFERENCES "issue"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slack_thread" DROP CONSTRAINT "FK_slack_thread_issue"`);
    await queryRunner.query(`ALTER TABLE "issue_history" DROP CONSTRAINT "FK_issue_history_user"`);
    await queryRunner.query(`ALTER TABLE "issue_history" DROP CONSTRAINT "FK_issue_history_issue"`);
    await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_issue_reporter"`);
    await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_issue_assignee"`);
    await queryRunner.query(`DROP TABLE "slack_thread"`);
    await queryRunner.query(`DROP TABLE "issue_history"`);
    await queryRunner.query(`DROP TABLE "issue"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
} 