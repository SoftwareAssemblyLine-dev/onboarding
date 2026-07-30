//import express from "express" 
//const router = express.Router()
import { Router } from "express"
import authController from "../controllers/authController.js"
import { validateRegistration, validateLogin } from "../middleware/validator.js"

const router = Router()

//POST /api/auth/register - Create a new user 
router.post("/register", validateRegistration, authController.register)

//POST /api/auth/login - Authenticate an existing user
router.post("/login", validateLogin, authController.login)

//GET /api/auth/users - Get/List all users (for debugging; remove in production)
router.get("/users", authController.getUsers)

export default router
