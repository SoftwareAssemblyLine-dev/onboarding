import { Request, Response, NextFunction } from "express"

// Define the shape of the register request body 
interface RegisterBody {
    email?: string;
    password?: string;
}

interface LoginBody {
    email?: string;
    password?: string;
}

// Validation error response shape
interface ValidationErrorResponse {
    success: false;
    errors: string[];
}

export const validateRegistration = (
    _request: Request<{}, {}, RegisterBody>, 
    _response: Response<ValidationErrorResponse>, 
    _next: NextFunction): void => 
{
    const { email, password } = _request.body

    const errors: string[] = []

    //Email validation 
    if(!email)
    {
        errors.push("Email is required.")
    }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    {
        errors.push("Please enter a valid email address.")
    }

    //Password validation 
    if(!password)
    {
        errors.push("Password is required.")
    }
    else if(password.length < 6)
    {
        errors.push("Password must be at least 6 characters long.")
    }

    if(errors.length > 0)
    {
        _response.status(400).json({
            success: false,
            errors
        })

        return
    }

    _next()
}

export const validateLogin = (
    _request: Request<{}, {}, LoginBody>, 
    _response: Response<ValidationErrorResponse>, 
    _next: NextFunction): void => 
{
    const { email, password } = _request.body

    const errors: string[] = []

    //Email validation 
    if(!email)
    {
        errors.push("Email is required.")
    }

    if(!password)
    {
        errors.push("Password is required.")
    }

    if(errors.length > 0)
    {
        _response.status(400).json({
            success: false,
            errors
        })

        return
    }

    _next()
}

//export default { validateRegistration, validateLogin };
