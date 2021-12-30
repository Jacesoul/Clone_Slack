import {MigrationInterface, QueryRunner} from "typeorm";

export class 1635238438619Migraion11635238496546 implements MigrationInterface {
    name = '1635238438619Migraion11635238496546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` DROP FOREIGN KEY \`FK_77afc26dfe5a8633e6ce35eaa44\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` DROP FOREIGN KEY \`FK_e53905ed6170fb65083051881e7\``);
        await queryRunner.query(`DROP INDEX \`IDX_1f3af49b8195937f52d3a66e56\` ON \`sleact\`.\`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_77afc26dfe5a8633e6ce35eaa4\` ON \`sleact\`.\`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_3446cc443ce59a7f7ae62acc16\` ON \`sleact\`.\`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_e53905ed6170fb65083051881e\` ON \`sleact\`.\`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`UserId\` ON \`sleact\`.\`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`UserId\` ON \`sleact\`.\`channelmembers\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` DROP COLUMN \`loggedInAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` ADD \`loggedInAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE INDEX \`UserId\` ON \`sleact\`.\`workspacemembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`UserId\` ON \`sleact\`.\`channelmembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_1f3af49b8195937f52d3a66e56\` ON \`sleact\`.\`workspacemembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_77afc26dfe5a8633e6ce35eaa4\` ON \`sleact\`.\`workspacemembers\` (\`WorkspaceId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_3446cc443ce59a7f7ae62acc16\` ON \`sleact\`.\`channelmembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_e53905ed6170fb65083051881e\` ON \`sleact\`.\`channelmembers\` (\`ChannelId\`)`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` ADD CONSTRAINT \`FK_77afc26dfe5a8633e6ce35eaa44\` FOREIGN KEY (\`WorkspaceId\`) REFERENCES \`sleact\`.\`workspaces\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` ADD CONSTRAINT \`FK_e53905ed6170fb65083051881e7\` FOREIGN KEY (\`ChannelId\`) REFERENCES \`sleact\`.\`channels\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` DROP FOREIGN KEY \`FK_e53905ed6170fb65083051881e7\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` DROP FOREIGN KEY \`FK_77afc26dfe5a8633e6ce35eaa44\``);
        await queryRunner.query(`DROP INDEX \`IDX_e53905ed6170fb65083051881e\` ON \`sleact\`.\`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_3446cc443ce59a7f7ae62acc16\` ON \`sleact\`.\`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_77afc26dfe5a8633e6ce35eaa4\` ON \`sleact\`.\`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_1f3af49b8195937f52d3a66e56\` ON \`sleact\`.\`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`UserId\` ON \`sleact\`.\`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`UserId\` ON \`sleact\`.\`workspacemembers\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` DROP COLUMN \`loggedInAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` ADD \`loggedInAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE INDEX \`UserId\` ON \`sleact\`.\`channelmembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`UserId\` ON \`sleact\`.\`workspacemembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_e53905ed6170fb65083051881e\` ON \`sleact\`.\`channelmembers\` (\`ChannelId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_3446cc443ce59a7f7ae62acc16\` ON \`sleact\`.\`channelmembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_77afc26dfe5a8633e6ce35eaa4\` ON \`sleact\`.\`workspacemembers\` (\`WorkspaceId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_1f3af49b8195937f52d3a66e56\` ON \`sleact\`.\`workspacemembers\` (\`UserId\`)`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`channelmembers\` ADD CONSTRAINT \`FK_e53905ed6170fb65083051881e7\` FOREIGN KEY (\`ChannelId\`) REFERENCES \`sleact\`.\`channels\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`sleact\`.\`workspacemembers\` ADD CONSTRAINT \`FK_77afc26dfe5a8633e6ce35eaa44\` FOREIGN KEY (\`WorkspaceId\`) REFERENCES \`sleact\`.\`workspaces\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
