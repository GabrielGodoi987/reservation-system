import { PropertyEntity } from "@/domain/entities/property/property.entity";
import { PropertyRepository } from "@/domain/repositories/property.repository";
import { PropertyMapper } from "@/infrastructure/mappers/property.mapper";
import { PropertyPersistenceEntity } from "@/infrastructure/persistence/entities/property.persistence.entity";
import { FindOptionsWhere, Repository } from "typeorm";

export class PropertyRepositoryImpl implements PropertyRepository {
  constructor(private readonly propertyDataSource: Repository<PropertyPersistenceEntity>) {}

  async findAll(): Promise<PropertyEntity[]> {
    const properties = await this.propertyDataSource.find();
    return properties.map((p) => PropertyMapper.toDomain(p));
  }

  async findById(id: string): Promise<PropertyEntity | null> {
    const found = await this.propertyDataSource.findOne({
      where: { id } as FindOptionsWhere<PropertyPersistenceEntity>,
    });
    if (!found) return null;
    return PropertyMapper.toDomain(found);
  }

  async save(propertyEntity: PropertyEntity): Promise<void> {
    const persistenceEntity = PropertyMapper.toPersistence(propertyEntity);
    await this.propertyDataSource.save(persistenceEntity);
  }

  async update(id: string, propertyEntity: PropertyEntity): Promise<void> {
    const persistenceEntity = PropertyMapper.toPersistence(propertyEntity);
    await this.propertyDataSource.update(id, {
      name: persistenceEntity.name,
      description: persistenceEntity.description,
      pricePerNight: persistenceEntity.pricePerNight,
      minGuests: persistenceEntity.minGuests,
      maxGuests: persistenceEntity.maxGuests,
    });
  }

  async delete(id: string): Promise<void> {
    await this.propertyDataSource.delete(id);
  }
}