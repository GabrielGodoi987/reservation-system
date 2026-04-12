import { Either, right, left, AppError, toAppError } from '../../../lib/either';
import { IPropertyService } from '../../interfaces/property-service.interface';
import { PropertyEntity } from '../../../domain/entities/property/property.entity';
import { IPropertyRepository } from '../../../domain/repositories/property.repository';

export class PropertyService implements IPropertyService {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async findAll(): Promise<Either<AppError, PropertyEntity[]>> {
    try {
      const properties = await this.propertyRepository.findAll();
      return right(properties);
    } catch (error) {
      return left(toAppError(error));
    }
  }

  async findById(id: string): Promise<Either<AppError, PropertyEntity | null>> {
    try {
      const property = await this.propertyRepository.findById(id);
      return right(property);
    } catch (error) {
      return left(toAppError(error));
    }
  }

  async create(property: PropertyEntity): Promise<Either<AppError, void>> {
    try {
      await this.propertyRepository.save(property);
      return right(undefined);
    } catch (error) {
      return left(toAppError(error));
    }
  }
}