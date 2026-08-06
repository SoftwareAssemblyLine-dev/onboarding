import { describe, it, expect, beforeEach } from '@jest/globals'
import request from "supertest"
import app from "../server.js"

//We need the app without starting the server, so we can test the routes directly
describe("Auth Routes", () => 
{
    describe("POST /api/auth/register", () => 
    {
        it("should register a new user and return 201", async () => 
        {
            const response = await request(app)
                .post("/api/auth/register")
                .send({ email: "newuser@test.com", password: "testpass123" })
            
            expect(response.status).toBe(201)
            expect(response.body.success).toBe(true)
            expect(response.body.user.email).toBe("newuser@test.com")
            // Ensure password is never returned
            expect(response.body.user.password).toBeUndefined()
        })

        it("should reject registration without email", async () => 
        {
            const response = await request(app)
                .post("/api/auth/register")
                .send({ password: "testpass123" })
            
            expect(response.status).toBe(400)
            expect(response.body.success).toBe(false)
            expect(response.body.errors).toBeDefined()  
        })

        it("should reject invalid email format", async () => 
        {
            const response = await request(app)
                .post("/api/auth/register")
                .send({ email: "notAnEmail", password: "testpass123" })

            expect(response.status).toBe(400)
            expect(response.body.errors).toContain("Please enter a valid email address.")
        })

        it("should reject short passwords", async () => 
        {
            const response = await request(app)
                .post("/api/auth/register")
                .send({ email: "test@example.com", password: "123" })

            expect(response.status).toBe(400)
            expect(response.body.errors).toContain("Password must be at least 6 characters long.")
        })

        it("should handle empty request body", async () => 
        {
            const response = await request(app)
                .post("/api/auth/register")
                .send({})

            expect(response.status).toBe(400)
            expect(response.body.errors).toBeDefined()
            expect(response.body.errors.length).toBeGreaterThanOrEqual(2)
        })
    })

    describe("POST /api/auth/login", () => 
    {
        beforeEach(async () => 
        {
            //Register a user to login with 
            await request(app)
                .post("/api/auth/register")
                .send({ email: "loginuser@test.com", password: "mypassword" })
        })

        it("should login with correct credentials", async () => 
        {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: "loginuser@test.com", password: "mypassword" })

            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)
        })

        it("should reject wrong password", async () => 
        {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: "loginuser@test.com", password: "wrongpassword" })

            expect(response.status).toBe(401)
            expect(response.body.success).toBe(false)
        })

        it("should reject missing email", async () => 
        {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ password: "mypassword" })

            expect(response.status).toBe(400)
            expect(response.body.errors).toContain("Email is required.")
        })

        it("should reject empty request body", async () => 
        {
            const response = await request(app)
                .post("/api/auth/login")
                .send({})

            expect(response.status).toBe(400)
            expect(response.body.errors).toBeDefined()
        })
    })

    describe("GET /api/auth/users", () => 
    {
        it("should return an empty list initially", async () => 
        {
            const response = await request(app)
                .get("/api/auth/users")

            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)
            expect(response.body.users).toBeDefined()
            expect(Array.isArray(response.body.users)).toBe(true)
        })
    })
})
