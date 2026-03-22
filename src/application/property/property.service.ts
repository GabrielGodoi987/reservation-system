import { PropertyEntity } from "../../domain/entities/property/property.entity";
import { PropertyRepository } from "../../domain/repositories/property.repository";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findAll(): Promise<PropertyEntity[]> {
    return await this.propertyRepository.findAll();
  }

  async findById(id: string): Promise<PropertyEntity | null> {
    return await this.propertyRepository.findById(id);
  }

  async create(property: PropertyEntity): Promise<void> {
    await this.propertyRepository.save(property);
  }
}
