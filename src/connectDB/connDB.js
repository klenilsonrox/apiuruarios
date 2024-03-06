import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
const user = process.env.DB_USER
const pass = process.env.DB_PASS


const DB_URL=`mongodb+srv://${user}:${pass}@users.bbwqfrl.mongodb.net/`

const connDB =async ()=>{
    try{
        await mongoose.connect(DB_URL)
        console.log("banco de dados conectado")
    }catch(error){
        console.log(error)
    }
}

export default connDB


