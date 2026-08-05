import { describe, it, expect } from '@jest/globals'
import request from "supertest"
import app from "../server.js"

//We need the app without starting the server, so we can test the routes directly
describe("End-to-End: User Registration & Login Flow", () => 
{
    const testUser = {
        email: `end2end-${Date.now()}@test.com`, // Unique email for each test run
        password: "end2endPass123"
    }

    let authToken: string | null = "mock-token-for-testing"
    void authToken // temporary variable/placeholder so lint does not complain about unused variable. Until the token is used in further tests, we can keep it as a placeholder.

    it("Step 1: Register a new user", async () => 
    {
        const response = await request(app)
            .post("/api/auth/register")
            .send(testUser)

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.user.email).toBe(testUser.email)
        // Password must not be returned in the response
        expect(response.body.user.password).toBeUndefined()
    })

    it("Step 2: Reject duplicate registration", async () => 
    {
        const response = await request(app)
            .post("/api/auth/register")
            .send(testUser)

        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toContain("already exists")
    })

    it("Step 3: Login with correct credentials", async () => 
    {
        const response = await request(app)
            .post("/api/auth/login")
            .send(testUser)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.email).toBe(testUser.email)
        authToken = response.body.token // If you add JWT token generation in your login route, you can capture it here for further tests. In Layer 2
    })

    it("Step 4: Reject login with wrong password", async () => 
    {
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: testUser.email, password: "wrongPassword" })

        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
    })

    it("Step 5: Verify user appears in users list", async () =>
    {
        const response = await request(app)
            .get("/api/auth/users")

        expect(response.status).toBe(200)
        const foundUser = response.body.users.find( (_user: { email: string }) => _user.email === testUser.email )
        expect(foundUser).toBeDefined()
        expect(foundUser.email).toBe(testUser.email)
    })
})
