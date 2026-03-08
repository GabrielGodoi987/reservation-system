import { Bookingstatus } from "src/domain/enums/booking-status.enum";
import { DateRange } from "src/domain/value-objects/date-range/date-range";
import { PropertyEntity } from "../property/property.entity";
import { UserEntity } from "../user/user.entity";

export class BookingEntity {
  private readonly id: string;
  private readonly property: PropertyEntity;
  private readonly user: UserEntity;
  private readonly dateRange: DateRange;
  private readonly guestsNumber: number;
  private readonly status: Bookingstatus = Bookingstatus.CREATED;

  constructor(
    id: string,
    property: PropertyEntity,
    user: UserEntity,
    dateRange: DateRange,
    guestsNumber: number,
  ) {
    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.guestsNumber = guestsNumber;
  }

  public getId(): string {
    return this.id;
  }

  public getProperty(): PropertyEntity {
    return this.property;
  }

  public getUser(): UserEntity {
    return this.user;
  }

  public getDateRange(): DateRange {
    return this.dateRange;
  }

  public getGuestsNumber(): number {
    return this.guestsNumber;
  }

  public getStatus(): Bookingstatus {
    return this.status;
  }
}
