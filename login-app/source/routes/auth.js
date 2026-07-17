//const express = require("express")
import express from "express" 
const router = express.Router()
//const authController = require("../controllers/authController.js")
import authController from "../controllers/authController.js"
//const { validateRegistration, validateLogin } = require("../middleware/validator.js")
import validator from "../middleware/validator.js"
const { validateRegistration, validateLogin } = validator

//POST /api/auth/register - Create a new user 
router.post("/register", validateRegistration, authController.register)

//POST /api/auth/login - Authenticate an existing user
router.post("/login", validateLogin, authController.login)

//GET /api/auth/users - Get/List all users (for debugging; remove in production)
router.get("/users", authController.getUsers)

//module.exports = router
export default router 
