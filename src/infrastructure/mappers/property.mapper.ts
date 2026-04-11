import { PropertyEntity } from "@/domain/entities/property/property.entity";
import { PropertyPersistenceEntity } from "../persistence/entities/property.persistence.entity";

export class PropertyMapper {
  static toDomain(entity: PropertyPersistenceEntity): PropertyEntity {
    return new PropertyEntity(
      entity.id,
      entity.name,
      entity.description,
      Number(entity.pricePerNight),
      entity.minGuests,
      entity.maxGuests,
    );
  }

  static toPersistence(entity: PropertyEntity): PropertyPersistenceEntity {
    const persistence = new PropertyPersistenceEntity();
    persistence.id = entity.getId();
    persistence.name = entity.getName();
    persistence.description = entity.getDescription();
    persistence.pricePerNight = entity.getPrice();
    persistence.minGuests = entity.getMinGuests();
    persistence.maxGuests = entity.getMaxGuests();
    return persistence;
  }
}