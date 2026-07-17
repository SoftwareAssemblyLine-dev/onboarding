import { jest, describe, beforeEach, it, expect } from "@jest/globals"
import validator from "./validator.js"

describe("Validator Middleware", () => 
{
    let validateRegistration
    let validateLogin

    beforeEach(() => 
    {
        //jest.resetModules()
        //const validator = require("./validator.js")
        //Since we're using ES modules, we need to re-import
        //Or better: don't reset modules
        validateRegistration = validator.validateRegistration
        validateLogin = validator.validateLogin
    })

    describe("validateRegistration", () => 
    {
        it("should pass valid input", () => 
        {
            const request = { 
                body: { email: "test@example.com", password: "password123" } 
            }
            
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            const next = jest.fn()

            validateRegistration(request, response, next)

            expect(next).toHaveBeenCalled()
            expect(response.status).not.toHaveBeenCalled()
        })

        it("should reject messing email", () => 
        {
            const request = {
                body: { password: "password123" }
            }

            const response = { 
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            const next = jest.fn()

            validateRegistration(request, response, next)

            expect(response.status).toHaveBeenCalledWith(400)
            expect(next).not.toHaveBeenCalled()
        })

        it("should reject invalid email format", () => 
        {
            const request = {
                body: { email: "notAnEmail", password: "password123" }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            const next = jest.fn()

            validateRegistration(request, response, next)

            expect(response.status).toHaveBeenCalledWith(400)
            expect(next).not.toHaveBeenCalled()
        })

        it("should reject short password", () => 
        {
            const request = {
                body: { email: "test@example.com", password: "123" }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            const next = jest.fn()

            validateRegistration(request, response, next)

            expect(response.status).toHaveBeenCalledWith(400)
            expect(next).not.toHaveBeenCalled()
        })
    })

    describe("validateLogin", () => 
    {
        it("should pass valid input", () => 
        {
            const request = {
                body: { email: "test@example.com", password: "password123" }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            const next = jest.fn()

            validateLogin(request, response, next)

            expect(next).toHaveBeenCalled()
        })

        it("should reject empty email", () => 
        {
            const request = {
                body: { password: "password123" }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            const next = jest.fn()

            validateLogin(request, response, next)

            expect(response.status).toHaveBeenCalledWith(400)
        })
    })
})