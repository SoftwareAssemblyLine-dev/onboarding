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
        })

        it("should reject registration without email", async () => 
        {
            const response = await request(app)
                .post("/api/auth/register")
                .send({ password: "testpass123" })
            
            expect(response.status).toBe(400)
            expect(response.body.success).toBe(false)    
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
    })
})
