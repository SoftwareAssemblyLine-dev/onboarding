const validateRegistration = (_request, _response, _next) => 
{
    const { email, password } = _request.body 

    const errors = []

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
        errors.push("Password must be at least 6 characters.")
    }

    if(errors.length > 0)
    {
        return _response.status(400).json({
            success: false,
            errors
        })
    }

    _next()
}

const validateLogin = (_request, _response, _next) => 
{
    const { email, password } = _request.body

    const errors = []

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
        return _response.status(400).json({
            success: false,
            errors
        })
    }

    _next()
}

export default { validateRegistration, validateLogin }
