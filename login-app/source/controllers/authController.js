//In-memory user store (will be replaced with a database in Layer 2)
export const createAuthController = (initialUsers = []) => 
{
    const users = [...initialUsers]

    const register = (_request, _response) => 
    {
        const { email, password } = _request.body

        const existingUser = users.find(_user => _user.email === email)
        if(existingUser) 
        {
            return _response.status(409).json({
                success: false,
                message: "A user with this email already exists."
            })
        }

        const newUser = {
            id: users.length + 1,
            email,
            password,
            createdAt: new Date().toISOString()
        }

        users.push(newUser)

        console.log(`New user registered: ${email} (total users: ${users.length})`)

        return _response.status(201).json({
            success: true,
            message: "Registration successful! Please log in.",
            user: {
                id: newUser.id,
                email: newUser.email
            }
        })
    }

    const login = (_request, _response) => 
    {
        const { email, password } = _request.body

        const user = users.find(_user => _user.email === email)
        if(!user) 
        {
            return _response.status(401).json({
                success: false,
                message: "No account found with this email."
            })
        }

        if(user.password !== password) 
        {
            return _response.status(401).json({
                success: false,
                message: "Incorrect password. Please try again."
            })
        }

        console.log(`User logged in: ${email}`)

        return _response.status(200).json({
            success: true,
            message: "Login successful!",
            user: {
                id: user.id,
                email: user.email
            }
        })
    }

    const getUsers = (_request, _response) => 
    {
        const safeUsers = users.map(({ id, email, createdAt }) => ({ id, email, createdAt }))
        
        return _response.json({
            success: true,
            count: safeUsers.length,
            users: safeUsers
        })
    }

    return { register, login, getUsers }
}

// Default export for production
export default createAuthController()