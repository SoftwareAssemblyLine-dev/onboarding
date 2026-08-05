export default {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/source"],
    testMatch: ["**/*.e2e.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    transform: {
        "^.+\\.ts$": "ts-jest"
    }
}

// 1. If want a named export instead of default export, you can use the following code
//export const config = { ... }

// 2. Then import it with 
//import { config } from "./jest.e2e.config.js"
