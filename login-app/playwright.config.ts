import { defineConfig } from "@playwright/test"

export default defineConfig({
    testDir: "source/end2end/gui",      // or wherever your GUI tests live
    testMatch: ["**/*.test.ts"],        // only match GUI test names 
    use: { 
        headless: true,
        baseURL: "http://localhost:3000" 
    },
    webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true
    }
})