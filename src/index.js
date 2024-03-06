import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import  connDB from "./connectDB/connDB.js"
import routerUser from "./routes/user.route.js"

dotenv.config()

const PORT = process.env.DB_PORT

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api", routerUser)

connDB()


app.listen(PORT || 4000, ()=>{
    console.log(`servidor rodando na porta ${PORT}`)
})