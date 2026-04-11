import { Repository } from 'typeorm';
import { PropertyEntity } from '@/domain/entities/property/property.entity';
import { PropertyRepositoryImpl } from '@/infrastructure/repositories/typeOrm/property/property.repository';
import { AppDataSource } from '@/data-source';
import { PropertyPersistenceEntity } from '@/infrastructure/persistence/entities/property.persistence.entity';

describe('Property repository unit test - TypeORM', () => {
  let propertyRepository: PropertyRepositoryImpl;
  let repository: Repository<PropertyPersistenceEntity>;

  beforeAll(async () => { 
    await AppDataSource.initialize();
    repository = AppDataSource.getRepository(PropertyPersistenceEntity);
    propertyRepository = new PropertyRepositoryImpl(repository);
  });

  afterAll(async () => { 
    await AppDataSource.destroy();
  });

  afterEach(async () => {
    await AppDataSource.query('TRUNCATE TABLE properties CASCADE');
  });

  describe('save', () => {
    it('Should save a property successfully', async () => {
      const property = new PropertyEntity(
        '550e8400-e29b-41d4-a716-446655440001',
        'Beach House',
        'Beautiful beach house with ocean view',
        200,
        2,
        6,
      );

      await propertyRepository.save(property);

      const savedProperty = await repository.findOne({ where: { id: property.getId() } });

      expect(savedProperty).not.toBeNull();
      expect(savedProperty!.id).toBe(property.getId());
      expect(savedProperty!.name).toBe('Beach House');
    });

    it('Should throw error when creating property with empty name', () => {
      expect(() => new PropertyEntity('550e8400-e29b-41d4-a716-446655440002', '', 'Description', 100, 1, 4)).toThrow('Name cannot be empty');
    });

    it('Should throw error when max guests is negative', () => {
      expect(() => new PropertyEntity('550e8400-e29b-41d4-a716-446655440003', 'Test', 'Description', 100, 1, -1)).toThrow('Max guests cannot be negative');
    });

    it('Should throw error when max guests is zero', () => {
      expect(() => new PropertyEntity('550e8400-e29b-41d4-a716-446655440004', 'Test', 'Description', 100, 1, 0)).toThrow('Max guests cannot be zero');
    });
  });

  describe('findById', () => {
    it('Should find a property by id successfully', async () => {
      const property = new PropertyEntity(
        '550e8400-e29b-41d4-a716-446655440005',
        'Mountain Cabin',
        'Cozy cabin in the mountains',
        150,
        1,
        4,
      );
      await repository.save(property as any);

      const foundProperty = await propertyRepository.findById('550e8400-e29b-41d4-a716-446655440005');

      expect(foundProperty).not.toBeNull();
      expect(foundProperty!.getId()).toBe('550e8400-e29b-41d4-a716-446655440005');
      expect(foundProperty!.getName()).toBe('Mountain Cabin');
    });

    it('Should return null when property not found', async () => {
      const foundProperty = await propertyRepository.findById('550e8400-e29b-41d4-a716-446655440999');

      expect(foundProperty).toBeNull();
    });
  });

  describe('findAll', () => {
    it('Should find all properties successfully', async () => {
      const property1 = new PropertyEntity('550e8400-e29b-41d4-a716-446655440006', 'Property One', 'Desc One', 100, 1, 4);
      const property2 = new PropertyEntity('550e8400-e29b-41d4-a716-446655440007', 'Property Two', 'Desc Two', 200, 2, 6);
      const property3 = new PropertyEntity('550e8400-e29b-41d4-a716-446655440008', 'Property Three', 'Desc Three', 300, 3, 8);

      await repository.save(property1 as any);
      await repository.save(property2 as any);
      await repository.save(property3 as any);

      const properties = await propertyRepository.findAll();

      expect(properties.length).toBe(3);
    });

    it('Should return empty array when no properties exist', async () => {
      const properties = await propertyRepository.findAll();

      expect(properties).toEqual([]);
    });
  });

  describe('update', () => {
    it('Should update a property successfully', async () => {
      const property = new PropertyEntity('550e8400-e29b-41d4-a716-446655440009', 'Original Name', 'Original Desc', 100, 1, 4);
      await repository.save(property as any);

      const updatedProperty = new PropertyEntity('550e8400-e29b-41d4-a716-446655440009', 'Updated Name', 'Updated Desc', 150, 2, 6);
      await propertyRepository.update('550e8400-e29b-41d4-a716-446655440009', updatedProperty);

      const foundProperty = await propertyRepository.findById('550e8400-e29b-41d4-a716-446655440009');

      expect(foundProperty).not.toBeNull();
      expect(foundProperty!.getName()).toBe('Updated Name');
    });

    it('Should not throw when updating non-existent property', async () => {
      const property = new PropertyEntity('550e8400-e29b-41d4-a716-446655440999', 'NonExistent', 'Desc', 100, 1, 4);

      await expect(propertyRepository.update('550e8400-e29b-41d4-a716-446655440999', property)).resolves.not.toThrow();
    });
  });

  describe('delete', () => {
    it('Should delete a property successfully', async () => {
      const property = new PropertyEntity('550e8400-e29b-41d4-a716-446655440010', 'To Be Deleted', 'Desc', 100, 1, 4);
      await repository.save(property as any);

      await propertyRepository.delete('550e8400-e29b-41d4-a716-446655440010');

      const deletedProperty = await propertyRepository.findById('550e8400-e29b-41d4-a716-446655440010');

      expect(deletedProperty).toBeNull();
    });

    it('Should not throw when deleting non-existent property', async () => {
      await expect(propertyRepository.delete('550e8400-e29b-41d4-a716-446655440999')).resolves.not.toThrow();
    });
  });
});