import { DateRange } from "./date-range";

describe("DateRange Value Object", () => {
  it("Should be defined", () => {
    expect(DateRange).toBeDefined();
  });

  describe("Failures", () => {
    it("Should thrown an erros if end date is before start date", () => {
      expect(() => {
        new DateRange(new Date("2024-01-10"), new Date("2023-01-01"));
      }).toThrow("End date must be after start date");
    });
    expect(() => {
      new DateRange(new Date("2024-12-25"), new Date("2023-12-20"));
    }).toThrow("End date must be after start date");
  });

  it("Should thrown an error if two date range are equal", () => {
    const dateRange1 = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-10"),
    );
    const dateRange2 = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-10"),
    );

    expect(() => {
      dateRange1.overlaps(dateRange2);
    }).toThrow("Ranges cannot be equal");
  });

  it("Should thrown an error if start and end date are equal", () => {
    const dateRange = new Date("2024-01-01");
    expect(() => {
      new DateRange(dateRange, dateRange);
    }).toThrow("Start and end date cannot be equal");
  });
});

describe("Success", () => {
  it("Should create a DateRange object if end date is after start date", () => {
    const startDate = new Date("2026-01-01");
    const endDate = new Date("2026-01-10");
    const dateRange = new DateRange(startDate, endDate);

    expect(dateRange).toBeInstanceOf(DateRange);
    expect(dateRange).toBeDefined();
    expect(dateRange.getStartDate()).toEqual(startDate);
    expect(dateRange.getEndDate()).toEqual(endDate);
  });

  it("Should calculate the correct amount of nights correctly", () => {
    const startDate = new Date("2026-01-01");
    const endDate = new Date("2026-01-10");
    const expectedTotalNights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    );
    const dateRange = new DateRange(startDate, endDate);

    const totalNights = dateRange.getTotalNights();

    console.info(
      `Total nights calculated: ${totalNights}, Expected total nights: ${expectedTotalNights}`,
    );
    expect(totalNights).toBe(expectedTotalNights);
  });

  it("Should verify if exists date overlap between two date ranges", () => {
    const dateRange1 = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-10"),
    );
    const dateRange2 = new DateRange(
      new Date("2026-01-05"),
      new Date("2026-01-15"),
    );

    const overlaps = dateRange1.overlaps(dateRange2);

    expect(overlaps).toBe(true);

    const dateRange3 = new DateRange(
      new Date("2026-01-08"),
      new Date("2026-01-12"),
    );

    const dateRange4 = new DateRange(
      new Date("2026-01-11"),
      new Date("2026-01-20"),
    );

    const overlaps2 = dateRange3.overlaps(dateRange4);

    expect(overlaps2).toBe(true);
  });
});
