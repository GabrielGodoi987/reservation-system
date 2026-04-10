module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  transformIgnorePatterns: ["node_modules/(?!uuid)/"],
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
