import { PropertyEntity } from "../entities/property/property.entity";

export interface PropertyRepository {
  findAll(): Promise<PropertyEntity[]>;
  findById(id: string): Promise<PropertyEntity | null>;
  save(user: PropertyEntity): Promise<void>;
}
