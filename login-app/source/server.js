//const express = require("express")
//const path = require("path")
//const authRoutes = require("./routes/auth.js")
import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js"

//Get __dirname equivalent in ES modules 
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
//const PORT = process.env.PORT || 3000

//Parse JSON bodies for API requests
app.use(express.json())

//Parse URL-encoded bodies for form submissions 
app.use(express.urlencoded({ extended: true }))

//Serve static files (HTML, CSS) from the public folder
app.use(express.static(path.join(__dirname, "..", "public")))

//API routes
app.use("/api/auth", authRoutes)

//Server login page as default route
app.get("/", (_request, _response) => 
{
    _response.sendFile(path.join(__dirname, "..", "public", "login.html"))
})

//Only start the server it this is run directly (If your server auto-starts on import: This should export the app without starting it) 
if(import.meta.url === `file://${process.argv[1]}`)
{
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => 
    {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}

//module.exports = app 
export default app 
