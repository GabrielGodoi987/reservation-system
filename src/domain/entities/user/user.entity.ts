export class UserEntity {
  private readonly id: string;
  private readonly name: string;

  constructor(id: string, name: string) {
    this.validateName(name);
    this.validateId(id);

    this.id = id;
    this.name = name;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  private validateName(name: string): void {
    if (!name) {
      throw new Error("Name cannot be empty");
    }
  }

  private validateId(id: string): void {
    if (!id) {
      throw new Error("ID cannot be empty");
    }
  }
}
