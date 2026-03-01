import { context } from "../../../lib/context";
import { PropertyEntity } from "./property.entity";
describe("Property Entity", () => {
  context("success", () => {
    it("Should create an object with the correct atributes", () => {
      const property = new PropertyEntity(
        "id",
        "beach house",
        "a nice beach house",
        100,
        2,
        4,
        false,
      );

      expect(property.getId()).toBe("id");
      expect(property.getName()).toBe("beach house");
      expect(property.getDescription()).toBe("a nice beach house");
      expect(property.getPrice()).toBe(100);
      expect(property.getMinGuests()).toBe(2);
      expect(property.getMaxGuests()).toBe(4);
      expect(property.isReserved()).toBe(false);
    });
  });
});
