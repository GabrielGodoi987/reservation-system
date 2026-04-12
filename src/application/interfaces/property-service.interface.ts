import { Either, AppError } from '../../lib/either';
import { PropertyEntity } from '../../domain/entities/property/property.entity';

export interface IPropertyService {
  findAll(): Promise<Either<AppError, PropertyEntity[]>>;
  findById(id: string): Promise<Either<AppError, PropertyEntity | null>>;
  create(property: PropertyEntity): Promise<Either<AppError, void>>;
}