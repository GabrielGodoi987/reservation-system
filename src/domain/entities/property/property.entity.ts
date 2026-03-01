export class PropertyEntity {
  private readonly id: string;
  private readonly name: string;
  private readonly description: string;
  private readonly price: number;
  private readonly minGuests: number;
  private readonly maxGuests: number;
  private reserved: boolean;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    minGuests: number,
    maxGuests: number,
    reserved: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.minGuests = minGuests;
    this.maxGuests = maxGuests;
    this.reserved = reserved;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  getMinGuests(): number {
    return this.minGuests;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  isReserved(): boolean {
    return this.reserved;
  }

  // reserve(): void {
  //   this.reserved = true;
  // }

  // cancelReservation(): void {
  //   this.reserved = false;
  // }
}
