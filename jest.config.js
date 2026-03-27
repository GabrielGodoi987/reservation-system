module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  transformIgnorePatterns: [
    "node_modules/(?!uuid)/"
  ],
};
