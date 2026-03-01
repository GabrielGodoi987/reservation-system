import { context } from "../../../lib/context";
import { UserEntity } from "./user.entity";

describe("User Entity", () => {
  context("success", () => {});

  context("failure", () => {
    it("should create an object with id and name", () => {
      const user = new UserEntity("1", "John Doe");

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.getId()).toBe("1");
      expect(user.getName()).toBe("John Doe");
    });

    it("Should throw an error if name is empty", () => {
      expect(() => new UserEntity("1", "")).toThrow("Name cannot be empty");
    });

    it("Should throw an error if name is null", () => {
      expect(() => new UserEntity("1", null as any)).toThrow(
        "Name cannot be empty",
      );
    });

    it("Should thrown an error if ID is empty", () => {
      expect(() => new UserEntity("", "John Doe")).toThrow(
        "ID cannot be empty",
      );
    });

    it("Should thrown an error if ID is null", () => {
      expect(() => new UserEntity(null as any, "John Doe")).toThrow(
        "ID cannot be empty",
      );
    });
  });
});
