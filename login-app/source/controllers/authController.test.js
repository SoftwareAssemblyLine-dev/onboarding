//We need to reset the users array before each test
//Since it's a module-level array, we'll require fresh each time to ensure isolation between tests
/*import { jest, describe, beforeEach, it, expect } from "@jest/globals"
import authController from "./authController.js" 
import validator from "../middleware/validator.js"

describe("Auth Controller", () => 
{
    //Reset the users array before each test
    //Since we can't easily reset the module, we'll use a workaround
    let authController

    beforeEach(async () => 
    {
        // Reset the module to clear the users array
        jest.resetModules()
        // Dynamically import to get fresh instance
        // In a real app, you'd use a database with transactions
        const module = await import("./authController.js")
        // We need to re-import to get fresh state
        // But since we're using ES modules, we need to use dynamic import
        authController = module.default
    })

    describe("register", () => 
    {
        it("should register a new user successfully", () => 
        {
            const request = {
                body: { email: "test@example.com", password: "password123" }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.register(request, response)

            expect(response.status).toHaveBeenCalledWith(201)
            expect(response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: "Registeration successful! Please log in."
                })
            )
        })

        it("should reject duplicate email registration", () => 
        {
            const request = {
                body: { email: "test@example.com", password: "password123"}
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            //Register first time 
            authController.register(request, response)

            //Reset mock for second call 
            response.status.mockClear()
            response.json.mockClear()

            //Register second time with same email 
            authController.register(request, response)

            expect(response.status).toHaveBeenCalledWith(409)
            expect(response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "A user with this email already exists."
                })
            )
        })
    })

    describe("login", () => 
    {
        it("should login with correct credentials", () => 
        {
            //Register a user first 
            const registerRequest = {
                body: { email: "user@example.com", password: "mypassword" }
            }

            const registerResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.register(registerRequest, registerResponse)

            //Now try to login with the same credentials
            const loginRequest = {
                body: { email: "user@example.com", password: "mypassword" }
            }

            const loginResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.login(loginRequest, loginResponse)

            expect(loginResponse.status).toHaveBeenCalledWith(200)
            expect(loginResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: "Login successful!"
                })
            )
        })

        it("should reject wrong password", () => 
        {
            //Register
            const registerRequest = {
                body: { email: "user2@example.com", password: "correctpass" }
            }

            const registerResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.register(registerRequest, registerResponse)

            //Login with wrong password
            const loginRequest = {
                body: { email: "user2@example.com", password: "wrongpass" }
            }

            const loginResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.login(loginRequest, loginResponse)

            expect(loginResponse.status).toHaveBeenCalledWith(401)
            expect(loginResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "Incorrect password. Please try again."
                })
            )
        })

        it("should reject non-existent user", () => 
        {
            const request = {
                body: { email: "ghost@example.com", password: "anything" }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.login(request, response)

            expect(response.status).toHaveBeenCalledWith(401)
            expect(response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "No account found with this email."
                })
            )
        })
    })

    // NEW: Tests for getUsers function
    describe("getUsers", () => 
    {
        it("should return empty list when no users exist", async () => 
        {
            // Reset module again to ensure clean state
            jest.resetModules()
            const module = await import("./authController.js")
            authController = module.default

            const request = {}
            const response = {
                json: jest.fn()
            }

            authController.getUsers(request, response)

            expect(response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    count: 0,
                    users: []
                })
            )
        })

        it("should return list of registered users without passwords", () => 
        {
            // Register a user first
            const registerRequest = {
                body: { email: "test1@example.com", password: "pass123" }
            }
            const registerResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            authController.register(registerRequest, registerResponse)

            // Register another user
            const registerRequest2 = {
                body: { email: "test2@example.com", password: "pass456" }
            }
            const registerResponse2 = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            authController.register(registerRequest2, registerResponse2)

            // Get users list
            const request = {}
            const response = {
                json: jest.fn()
            }

            authController.getUsers(request, response)

            expect(response.json).toHaveBeenCalled()
            const callArgs = response.json.mock.calls[0][0]
            expect(callArgs.success).toBe(true)
            expect(callArgs.count).toBe(2)
            expect(callArgs.users).toHaveLength(2)
            
            // Verify passwords are not included
            callArgs.users.forEach(user => {
                expect(user).not.toHaveProperty('password')
                expect(user).toHaveProperty('id')
                expect(user).toHaveProperty('email')
                expect(user).toHaveProperty('createdAt')
            })
        })

        it("should return users with correct properties", () => 
        {
            // Register a user
            const registerRequest = {
                body: { email: "test3@example.com", password: "pass789" }
            }
            const registerResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            authController.register(registerRequest, registerResponse)

            // Get users list
            const request = {}
            const response = {
                json: jest.fn()
            }

            authController.getUsers(request, response)

            expect(response.json).toHaveBeenCalled()
            const callArgs = response.json.mock.calls[0][0]
            expect(callArgs.users[0]).toMatchObject({
                id: expect.any(Number),
                email: "test3@example.com",
                createdAt: expect.any(String)
            })
        })
    })
})
*/

import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { createAuthController } from "./authController.js"

describe("Auth Controller", () => 
{
    let authController

    beforeEach(() => 
    {
        // Fresh instance for each test - completely isolated!
        authController = createAuthController()
    })

    describe("register", () => 
    {
        it("should register a new user successfully", () => 
        {
            const request = {
                body: { email: "test@example.com", password: "password123" }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.register(request, response)

            expect(response.status).toHaveBeenCalledWith(201)
            expect(response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: "Registration successful! Please log in."
                })
            )
        })

        // ... rest of tests with the same pattern
        it("should reject duplicate email registration", () => 
        {
            const request = {
                body: { email: "test@example.com", password: "password123"}
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            //Register first time 
            authController.register(request, response)

            //Reset mock for second call 
            response.status.mockClear()
            response.json.mockClear()

            //Register second time with same email 
            authController.register(request, response)

            expect(response.status).toHaveBeenCalledWith(409)
            expect(response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "A user with this email already exists."
                })
            )
        })
    })

    describe("login", () => 
    {
        it("should login with correct credentials", () => 
        {
            //Register a user first 
            const registerRequest = {
                body: { email: "user@example.com", password: "mypassword" }
            }

            const registerResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.register(registerRequest, registerResponse)

            //Now try to login with the same credentials
            const loginRequest = {
                body: { email: "user@example.com", password: "mypassword" }
            }

            const loginResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.login(loginRequest, loginResponse)

            expect(loginResponse.status).toHaveBeenCalledWith(200)
            expect(loginResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: "Login successful!"
                })
            )
        })

        it("should reject wrong password", () => 
        {
            //Register
            const registerRequest = {
                body: { email: "user2@example.com", password: "correctpass" }
            }

            const registerResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.register(registerRequest, registerResponse)

            //Login with wrong password
            const loginRequest = {
                body: { email: "user2@example.com", password: "wrongpass" }
            }

            const loginResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.login(loginRequest, loginResponse)

            expect(loginResponse.status).toHaveBeenCalledWith(401)
            expect(loginResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "Incorrect password. Please try again."
                })
            )
        })

        it("should reject non-existent user", () => 
        {
            const request = {
                body: { email: "ghost@example.com", password: "anything" }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            authController.login(request, response)

            expect(response.status).toHaveBeenCalledWith(401)
            expect(response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "No account found with this email."
                })
            )
        })
    })

    describe("getUsers", () => 
    {
        it("should return empty list when no users exist", () => 
        {
            const request = {}
            const response = {
                json: jest.fn()
            }

            authController.getUsers(request, response)

            expect(response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    count: 0,
                    users: []
                })
            )
        })

        it("should return list of registered users without passwords", () => 
        {
            // Register two users
            const registerRequest1 = {
                body: { email: "test1@example.com", password: "pass123" }
            }
            const registerResponse1 = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            authController.register(registerRequest1, registerResponse1)

            const registerRequest2 = {
                body: { email: "test2@example.com", password: "pass456" }
            }
            const registerResponse2 = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            authController.register(registerRequest2, registerResponse2)

            const request = {}
            const response = {
                json: jest.fn()
            }

            authController.getUsers(request, response)

            expect(response.json).toHaveBeenCalled()
            const callArgs = response.json.mock.calls[0][0]
            expect(callArgs.success).toBe(true)
            expect(callArgs.count).toBe(2)
            expect(callArgs.users).toHaveLength(2)
            
            callArgs.users.forEach(user => 
            {
                expect(user).not.toHaveProperty('password')
                expect(user).toHaveProperty('id')
                expect(user).toHaveProperty('email')
                expect(user).toHaveProperty('createdAt')
            })
        })

        it("should return users with correct properties", () => 
        {
            const registerRequest = {
                body: { email: "test3@example.com", password: "pass789" }
            }
            const registerResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            authController.register(registerRequest, registerResponse)

            const request = {}
            const response = {
                json: jest.fn()
            }

            authController.getUsers(request, response)

            expect(response.json).toHaveBeenCalled()
            const callArgs = response.json.mock.calls[0][0]
            expect(callArgs.users[0]).toMatchObject({
                id: expect.any(Number),
                email: "test3@example.com",
                createdAt: expect.any(String)
            })
        })
    })
})

