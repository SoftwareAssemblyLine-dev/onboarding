import { jest, describe, beforeEach, it, expect } from "@jest/globals"
import { Request, Response, NextFunction } from "express"
import { validateRegistration, validateLogin } from "./validator.js"

describe("Validator Middleware", () => 
{
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let nextFunction: NextFunction

    beforeEach(() => 
    {
        mockRequest = { body: {} }
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as Partial<Response>
        nextFunction = jest.fn()
    })

    describe("validateRegistration", () => 
    {
        it("should pass valid input", () => 
        {
            mockRequest.body = { email: "test@example.com", password: "password123" }
            
            validateRegistration(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(nextFunction).toHaveBeenCalled()
            expect(mockResponse.status).not.toHaveBeenCalled()
        })

        it("should reject missing email", () => 
        {
            mockRequest.body = { password: "password123" }

            validateRegistration(
                mockRequest as Request, 
                mockResponse as Response, 
                nextFunction
            )

            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    errors: expect.arrayContaining(["Email is required."])
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it("should reject invalid email format", () => 
        {
            mockRequest.body = { email: "notAnEmail", password: "password123" }

            validateRegistration(
                mockRequest as Request, 
                mockResponse as Response, 
                nextFunction
            )

            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    errors: expect.arrayContaining(["Please enter a valid email address."])
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it("should reject short password", () => 
        {
            mockRequest.body = { email: "test@example.com", password: "123" }

            validateRegistration(
                mockRequest as Request, 
                mockResponse as Response, 
                nextFunction
            )

            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: expect.arrayContaining(["Password must be at least 6 characters long."])
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it("should reject missing password", () => 
        {
            mockRequest.body = { email: "test@example.com" }

            validateRegistration(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    errors: expect.arrayContaining(["Password is required."])
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })
    })

    describe("validateLogin", () => 
    {
        it("should pass valid input", () => 
        {
            mockRequest.body = { email: "test@example.com", password: "password123" }

            validateLogin(
                mockRequest as Request, 
                mockResponse as Response, 
                nextFunction
            )

            expect(nextFunction).toHaveBeenCalled()
        })

        it("should reject empty email, login with missing email", () => 
        {
            mockRequest.body = { password: "password123" }

            validateLogin(
                mockRequest as Request, 
                mockResponse as Response, 
                nextFunction
            )

            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    errors: expect.arrayContaining(["Email is required."])
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it("should reject login with missing password", () => 
        {
            mockRequest.body = { email: "test@example.com" }

            validateLogin(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    errors: expect.arrayContaining(["Password is required."])
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })
    })
})