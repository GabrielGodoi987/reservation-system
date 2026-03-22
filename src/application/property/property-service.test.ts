import { PropertyService } from "../../../src/application/property/property.service";
import { FakePropertyRepository } from "../../../src/infrastructure/repositories/property/fake-property.repository";
import { PropertyEntity } from "../../domain/entities/property/property.entity";
import { context } from "../../lib/context";

describe("PropertyService", () => {
  let propertyRepository: FakePropertyRepository;
  let propertyService: PropertyService;

  beforeAll(() => {
    propertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(propertyRepository);
  });

  context("success", () => {
    it("should find a property by id", async () => {
      const property = await propertyService.findById("3");

      const properties = await propertyService.findAll();

      expect(property).not.toBeNull();
      expect(property?.getId()).toBe("3");
      expect(property?.getName()).toBe("Property 3");
    });

    it("should create a property and return it", async () => {
      const newProperty = new PropertyEntity(
        "11",
        "Penthous at LA",
        "Gabriel Godoi's hotel at LA near to the beach",
        300,
        2,
        10,
      );

      await propertyService.create(newProperty);

      const newSavedProperty = await propertyService.findById(
        newProperty.getId(),
      );

      expect(newSavedProperty).not.toBeNull();
      expect(newSavedProperty?.getId()).toBe(newProperty.getId());
      expect(newSavedProperty?.getName()).toBe(newProperty.getName());
    });

    it("should find all properties", async () => {
      const properties = await propertyService.findAll();

      expect(properties.length).toBe(11);
    });
  });

  context("failure", () => {
    it("should return null when id is not valid", async () => {
      const invalidProperty = await propertyService.findById("999");

      expect(invalidProperty).toBeNull();
    });
  });
});
