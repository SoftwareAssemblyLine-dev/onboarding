export default {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    roots: ["<rootDir>/source/end2end/jest"],
    testMatch: ["**/*.test.ts"],
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    moduleFileExtensions: ["ts", "js", "json"],
    transform: {
        "^.+\\.ts$": ["ts-jest", { useESM: true }]
    }
}

// 1. If want a named export instead of default export, you can use the following code
//export const config = { ... }

// 2. Then import it with 
//import { config } from "./jest.e2e.config.js"
