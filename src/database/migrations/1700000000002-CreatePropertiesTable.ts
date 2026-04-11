import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePropertiesTable1700000000002 implements MigrationInterface {
  name = 'CreatePropertiesTable1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'properties',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'pricePerNight',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'minGuests',
            type: 'int',
          },
          {
            name: 'maxGuests',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('properties');
  }
}