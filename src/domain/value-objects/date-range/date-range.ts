export class DateRange {
  private readonly start: Date;
  private readonly end: Date;

  constructor(start: Date, end: Date) {
    this.validateDates(start, end);
    this.start = start;
    this.end = end;
  }

  public getStartDate(): Date {
    return this.start;
  }

  public getEndDate(): Date {
    return this.end;
  }

  public getTotalNights(): number {
    const startDate = this.getStartDate();
    const endDate = this.getEndDate();

    const timeDiff = endDate.getTime() - startDate.getTime();
    const totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24)); // round up to the nearest whole number of nights

    return totalNights;
  }

  private validateDates(startDate: Date, endDate: Date): void {
    if (startDate.getTime() === endDate.getTime()) {
      throw new Error("Start and end date cannot be equal");
    }

    if (endDate < startDate) {
      throw new Error("End date must be after start date");
    }
  }

  overlaps(dateRange: DateRange): boolean {
    if (
      this.start.getTime() === dateRange.getStartDate().getTime() &&
      this.end.getTime() === dateRange.getEndDate().getTime()
    ) {
      throw new Error("Ranges cannot be equal");
    }

    return (
      this.start < dateRange.getEndDate() && this.end > dateRange.getStartDate()
    );
  }
}
