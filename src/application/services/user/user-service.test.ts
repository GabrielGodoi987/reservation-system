import { UserService } from "@/application/services/user/user.service";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { FakeUserRepository } from "@/infrastructure/repositories/user/fake-user.repository";
import { context } from "@/lib/context";

describe("UserService", () => {
  let userService: UserService;
  let fakeUserRepository: FakeUserRepository;

  beforeAll(() => {
    fakeUserRepository = new FakeUserRepository();
    userService = new UserService(fakeUserRepository);
  });

  context("success", () => {
    it("Should return all users", async () => {
      const users = await userService.findAll();

      expect(users.length).toBe(10);
    });

    it("Should return an user when an valid id is being provided", async () => {
      const userEntity = new UserEntity("11", "Gabriel Godoi");
      fakeUserRepository.save(userEntity);

      const user = await userService.findById(userEntity.getId());

      expect(user).toBe(userEntity);
      expect(user).not.toBeNull();
      expect(user?.getId()).toBe(userEntity.getId());
      expect(user?.getName()).toBe(userEntity.getName());
    });

    it("Should save a new user and find it in the database", async () => {
      const newUser = new UserEntity("12", "new user");
      await userService.create(newUser);

      const newSavedUser = await userService.findById(newUser.getId());

      expect(newSavedUser).not.toBeNull();
      expect(newSavedUser?.getId()).toBe(newUser.getId());
      expect(newSavedUser?.getName()).toBe(newUser.getName());
    });
  });

  context("failure", () => {
    it("Shoudl return null when user doesnt exists", async () => {
      const user = await userService.findById("999");
      expect(user).toBeNull();
    });
  });
});
