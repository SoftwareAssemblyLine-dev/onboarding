import globals from "globals"
import js from "@eslint/js"
//import ts from "@typescript-eslint/eslint-plugin"
//import tsParser from "@typescript-eslint/parser"

export default [
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "build/**",
            "coverage/**"
        ]
    },
    // Include ESLint recommended rules
    js.configs.recommended,
    // ============================================
    // JAVASCRIPT FILES 
    // ============================================
    {
        files: ["**/*.js", "**/*.mjs"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.jest
            }
        },
        rules: {
            // Your rules OVERRIDE the recommended ones
            // Allman style
            "brace-style": ["error", "allman", { "allowSingleLine": true }],
            // Formatting
            "indent": ["error", 4],
            //"semi": ["error", "never"],
            "comma-dangle": ["error", "never"],
            //"object-curly-spacing": ["error", "always"],
            "space-before-function-paren": ["error", "always"],
            // ...
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "no-console": "off"
        }
    },
    // ============================================
    // TYPESCRIPT FILES - Semicolons REQUIRED
    // ============================================
    /*{
        files: ["** /*.ts", "** /*.tsx"],
        plugins: {
            "@typescript-eslint": ts
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: "module",
            globals: { ...globals.node, ...globals.jest }
        },
        rules: {
            // Allman style for TypeScript too
            "brace-style": ["error", "allman", { "allowSingleLine": true }],
            // TypeScript - SEMICOLONS REQUIRED
            "semi": ["error", "always"],
            // TypeScript specific rules
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "@typescript-eslint/explicit-function-return-type": "off",
            // Other formatting
            "indent": ["error", 4],
            //"quotes": ["error", "single"],
            "comma-dangle": ["error", "never"],
            //"object-curly-spacing": ["error", "always"],
            "space-before-function-paren": ["error", "always"],
            "no-console": "off"
        }
    },*/
    // ============================================
    // COMMONJS FILES 
    // ============================================
    {
        files: ["**/*.cjs"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                ...globals.jest
            }
        },
        rules: {
            // Your rules OVERRIDE the recommended ones
            // Allman style
            "brace-style": ["error", "allman", { "allowSingleLine": true }],
            // Formatting
            "indent": ["error", 4],
            //"semi": ["error", "false"],
            "comma-dangle": ["error", "never"],
            //"object-curly-spacing": ["error", "always"],
            "space-before-function-paren": ["error", "always"],
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "no-console": "off"
        }
    },
    // Optional: Test files specific rules
    {
        files: ["**/*.test.js", "**/*.spec.js"],
        rules: {
            "no-unused-vars": "off" // Or less strict for tests
        }
    }
]