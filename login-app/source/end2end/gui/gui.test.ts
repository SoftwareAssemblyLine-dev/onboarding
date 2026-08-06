import { test, expect } from "@playwright/test"

const BASE_URL = "http://localhost:3000"

test.describe("GUI: Login & Registration Pages", () => 
{
    test.beforeEach(async ({ page }) => 
    {
        // Start fresh - clear, no cookies and no localStorage 
        await page.context().clearCookies()
    })

    test("Login page loads correctly", async ({ page }) => 
    {
        //await page.goto(BASE_URL) //version 1
        await page.goto("/") //version 2

        // Verify page elements
        await expect(page.locator("h1")).toHaveText("Login")
        await expect(page.locator("#email")).toBeVisible()
        await expect(page.locator("#password")).toBeVisible()
        await expect(page.locator("button[type='submit']")).toHaveText("Login")
        await expect(page.locator(".switch-link a")).toHaveText("Create one")
    })

    test("Can navigate from login to register page", async ({ page }) => 
    {
        await page.goto(BASE_URL)
        await page.click(".switch-link a")
        await expect(page).toHaveURL(/register\.html/)
        await expect(page.locator("h1")).toHaveText("Create Account")
    })

    test("Registration from validates input", async ({ page }) => 
    {
        await page.goto(`${BASE_URL}/register.html`)

        // Submit empty form - browser should block it
        const valid = await page.$eval("#registerForm", (_form: HTMLFormElement) => _form.checkValidity())
        expect(valid).toBe(false)
        
        // Fill a valid email and password and verify validity becomes true
        await page.fill("#email", "test@example.com")
        await page.fill("#password", "guiTestPassword123")
        const validAfter = await page.$eval("#registerForm", (_form: HTMLFormElement) => _form.checkValidity())
        expect(validAfter).toBe(true)

        // Invalid email 
        await page.fill("#email", "notAnEmail")
        await page.fill("#password", "123")
        await page.click("button[type='submit']")
        await expect(page.locator("#registerMessage")).toContainText("valid email")

        // Password too short 
        await page.fill("#email", "test@example.com")
        await page.fill("#password", "123")
        await page.click("button[type='submit']")
        await expect(page.locator("#registerMessage")).toContainText("Password must be at least 6 characters long.")
    })

    test("Full user flow: register -> redirect -> login", async ({ page }) => 
    {
        const uniqueEmail = `gui-${Date.now()}@test.com`

        // Register 
        await page.goto(`${BASE_URL}/register.html`)
        await page.fill("#email", uniqueEmail)
        await page.fill("#password", "guiTestPass123")
        await page.click("button[type='submit']")

        // Wait for success message and redirect
        await expect(page.locator("#registerMessage")).toContainText("Registration successful")
        await page.waitForURL(/login\.html/, { timeout: 5000 })

        // Login with the new account 
        await page.fill("#email", uniqueEmail)
        await page.fill("#password", "guiTestPass123")
        await page.click("button[type='submit']")

        // Verify login success
        await expect(page.locator("#loginMessage")).toContainText("Login successful")
        await expect(page.locator("#loginMessage")).toContainText(uniqueEmail)
    })

    test("Login with wrong password shows error", async ({ page }) => 
    {
        await page.goto(BASE_URL)
        await page.fill("#email", "nonexistent@test.com")
        await page.fill("#password", "wrongpassword")
        await page.click("button[type='submit']")

        await expect(page.locator("#loginMessage")).toContainText("Invalid email or password. Please try again.")
    })
})