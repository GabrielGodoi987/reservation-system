import { BookingEntity } from "@/domain/entities/booking/booking.entity";
import { PropertyEntity } from "@/domain/entities/property/property.entity";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { DateRange } from "@/domain/value-objects/date-range/date-range";
import { BookingPersistenceEntity } from "../persistence/entities/booking.persistence.entity";

export class BookingMapper {
  static toDomain(entity: BookingPersistenceEntity, property: PropertyEntity, user: UserEntity): BookingEntity {
    const dateRange = new DateRange(entity.startDate, entity.endDate);
    const booking = new BookingEntity(
      entity.id,
      property,
      user,
      dateRange,
      entity.guestsNumber,
    );
    return booking;
  }

  static toPersistence(entity: BookingEntity): BookingPersistenceEntity {
    const persistence = new BookingPersistenceEntity();
    persistence.id = entity.getId();
    persistence.propertyId = entity.getProperty().getId();
    persistence.userId = entity.getUser().getId();
    persistence.userName = entity.getUser().getName();
    persistence.startDate = entity.getDateRange().getStartDate();
    persistence.endDate = entity.getDateRange().getEndDate();
    persistence.guestsNumber = entity.getGuestsNumber();
    persistence.status = entity.getStatus();
    persistence.totalPrice = entity.getTotalPrice();
    return persistence;
  }
}