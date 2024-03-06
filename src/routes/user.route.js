import { Router } from "express";
import { login, register} from "../controllers/userController.js";

const routerUser = Router()

routerUser.get("/", (req,res)=>{
    return res.status(200).json({
        status:"ok"
    })
})

routerUser.post("/register", register)
routerUser.post("/login", login)


export default routerUser