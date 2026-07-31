//In-memory user store (will be replaced with a database in Layer 2)
import { Request, Response } from "express"

//---- Type Definitions ----
interface User {
    id: number;
    email: string;
    password: string;
    createdAt: string;
}

//What we return to clients (never include password)
interface SafeUser {
    id: number;
    email: string;
    createdAt: string;
}

interface RegisterRequest {
    email: string;
    password: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    errors?: string[];
    user?: T;
    count?: number;
    users?: T[];
}

export const createAuthController = (initialUsers: User[] = []) => 
{
    //---- In-Memory Store ----
    const users: User[] = [...initialUsers]

    const register = (
        _request: Request<{}, {}, RegisterRequest>, 
        _response: Response<ApiResponse<SafeUser>>): void => 
    {
        const { email, password } = _request.body

        const existingUser = users.find((_user) => _user.email === email)
        if(existingUser) 
        {
            _response.status(409).json({
                success: false,
                message: "A user with this email already exists."
            })

            return
        }

        const newUser = {
            id: users.length + 1,
            email,
            password,
            createdAt: new Date().toISOString()
        }

        users.push(newUser)

        console.log(`New user registered: ${email} (total users: ${users.length})`)

        _response.status(201).json({
            success: true,
            message: "Registration successful! Please log in.",
            user: {
                id: newUser.id,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        })
    }

    const login = (
        _request: Request<{}, {}, LoginRequest>, 
        _response: Response<ApiResponse<SafeUser>>): void => 
    {
        const { email, password } = _request.body
        console.log(undefinedVariable)

        const user = users.find((_user) => _user.email === email)
        if(!user) 
        {
            _response.status(401).json({
                success: false,
                message: "Invalid email or password. Please try again." // Generic message hides what failed
            })

            return
        }

        if(user.password !== password) 
        {
            _response.status(401).json({
                success: false,
                message: "Invalid email or password. Please try again." // Generic message hides what failed
            })

            return
        }

        console.log(`User logged in: ${email}`)

        _response.status(200).json({
            success: true,
            message: "Login successful!",
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt
            }
        })
    }

    const getUsers = (
        _request: Request, 
        _response: Response<ApiResponse<SafeUser>>): void => 
    {
        const safeUsers = users.map(({ id, email, createdAt }) => ({ id, email, createdAt }))
        
        _response.json({
            success: true,
            count: safeUsers.length,
            users: safeUsers
        })
    }

    return { register, login, getUsers }
}

// Initialize the default production instance
const authController = createAuthController()
//Destructure and export the individual methods as Named Exports (Supports Three-shaking!)
export const { register, login, getUsers } = authController

// Default export for production
export default createAuthController()
