import { PropertyEntity } from "@/domain/entities/property/property.entity";
import { PropertyRepository } from "@/domain/repositories/property.repository";

export class FakePropertyRepository implements PropertyRepository {
  private properties: PropertyEntity[] = Array.from(
    { length: 10 },
    (_, i: number) => {
      return new PropertyEntity(
        `${i}`,
        `Property ${i}`,
        `Description to property ${i}`,
        200,
        2,
        20,
      );
    },
  );

  async findAll(): Promise<PropertyEntity[]> {
    return await this.properties;
  }

  async findById(id: string): Promise<PropertyEntity | null> {
    return (
      (await this.properties.find((property) => property.getId() === id)) ||
      null
    );
  }

  async save(property: PropertyEntity): Promise<void> {
    await this.properties.push(property);
  }
}
