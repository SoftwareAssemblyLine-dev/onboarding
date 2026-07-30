//We need to reset the users array before each test
//Since it's a module-level array, we'll require fresh each time to ensure isolation between tests
import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { createAuthController } from "./authController.js"
import { Request, Response } from "express"
//import { register, login, getUsers } from "./authController.js"

// Becuase the `users` array is module-scoped, we need it between tests.
// We do this by resetting the module cache before each test.
let authController : ReturnType<typeof createAuthController>

beforeEach(() => 
{
    authController = createAuthController()
})

describe("Auth Controller", () => 
{
    /*let authController

    beforeEach(() => 
    {
        // Fresh instance for each test - completely isolated!
        authController = createAuthController()
    })*/
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>

    beforeEach(() => 
    {
        mockRequest = { body: {} }
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as Partial<Response>
    })

    describe("register", () => 
    {
        it("should register a new user successfully", () => 
        {
            mockRequest.body = { email: "test@example.com", password: "password123" }

            authController.register(
                mockRequest as Request, 
                mockResponse as Response
            )

            expect(mockResponse.status).toHaveBeenCalledWith(201)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: "Registration successful! Please log in."
                })
            )
        })

        // ... rest of tests with the same pattern
        it("should reject duplicate email registration", () => 
        {
            mockRequest.body = { email: "test@example.com", password: "password123"}

            //Register first time 
            authController.register(
                mockRequest as Request, 
                mockResponse as Response
            );

            //Reset mock for second call 
            (mockResponse.status as jest.Mock).mockClear();
            //(mockResponse.status as any).mockClear()
            (mockResponse.json as jest.Mock).mockClear()

            //Register second time with same email 
            authController.register(
                mockRequest as Request, 
                mockResponse as Response
            )

            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith(
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
            mockRequest.body = { email: "user@example.com", password: "mypassword" }

            authController.register(
                mockRequest as Request, 
                mockResponse as Response
            );

            // Reset mocks 
            //(mockResponse.status as jest.Mock).mockClear();
            (mockResponse.status as any).mockClear();
            (mockResponse.json as jest.Mock).mockClear();

            //Now try to login with the same credentials
            authController.login(
                mockRequest as Request, 
                mockResponse as Response
            )

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: "Login successful!"
                })
            )
        })

        it("should reject wrong password", () => 
        {
            //Register
            mockRequest.body = { email: "user2@example.com", password: "correctpass" }

            authController.register(
                mockRequest as Request, 
                mockResponse as Response
            );

            // Reset 
            //(mockResponse.status as jest.Mock).mockClear()
            (mockResponse.status as any).mockClear();
            (mockResponse.json as jest.Mock).mockClear();

            //Login with wrong password
            mockRequest.body = { email: "user2@example.com", password: "wrongpass" }

            authController.login(
                mockRequest as Request, 
                mockResponse as Response
            )

            expect(mockResponse.status).toHaveBeenCalledWith(401)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "Invalid email or password. Please try again." // Generic message hides what failed
                })
            )
        })

        it("should reject non-existent user", () => 
        {
            mockRequest.body = { email: "ghost@example.com", password: "anything" }

            authController.login(
                mockRequest as Request, 
                mockResponse as Response
            )

            expect(mockResponse.status).toHaveBeenCalledWith(401)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "Invalid email or password. Please try again." // Generic message hides what failed
                })
            )
        })
    })

    describe("getUsers", () => 
    {
        it("should return empty list when no users exist", () => 
        {
            authController.getUsers(
                mockRequest as Request, 
                mockResponse as Response
            )

            expect(mockResponse.json).toHaveBeenCalledWith(
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
            const registerRequest1: Partial<Request> = {
                body: { email: "test1@example.com", password: "pass123" }
            } as Partial<Request>

            const registerResponse1: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Partial<Response>

            authController.register(registerRequest1 as Request, registerResponse1 as Response);

            const registerRequest2: Partial<Request> = {
                body: { email: "test2@example.com", password: "pass456" }
            } as Partial<Request>

            const registerResponse2: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Partial<Response>

            authController.register(registerRequest2 as Request, registerResponse2 as Response)

            authController.getUsers(
                mockRequest as Request, 
                mockResponse as Response
            )

            expect(mockResponse.json).toHaveBeenCalled()
            const callArgs = (mockResponse.json as jest.Mock).mock.calls[0][0] as any
            expect(callArgs.success).toBe(true)
            expect(callArgs.count).toBe(2)
            expect(callArgs.users).toHaveLength(2)
            
            callArgs.users.forEach((user: any) => 
            {
                expect(user).not.toHaveProperty('password')
                expect(user).toHaveProperty('id')
                expect(user).toHaveProperty('email')
                expect(user).toHaveProperty('createdAt')
            })
        })

        it("should return users with correct properties", () => 
        {
            mockRequest.body = { email: "test3@example.com", password: "pass789" }

            authController.register(
                mockRequest as Request, 
                mockResponse as Response
            )

            const getUsersResponse: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Partial<Response>

            authController.getUsers(
                mockRequest as Request, 
                getUsersResponse as Response
            )

            expect(getUsersResponse.json).toHaveBeenCalled()
            const callArgs = (getUsersResponse.json as jest.Mock).mock.calls[0][0] as any
            expect(callArgs.users[0]).toMatchObject({
                id: expect.any(Number),
                email: "test3@example.com",
                createdAt: expect.any(String)
            })
        })
    })
})
