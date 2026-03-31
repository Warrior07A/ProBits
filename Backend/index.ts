import express, { type Request, type Response } from "express";
import { signupSchema } from "./Types/types";
const app = express();
app.use(express.json());

function ferr(msg : string , code : number , res : Response){
    return res.status(code).json({
        success : false,
        msg : msg
    })
}
app.post("/signup" , async(req : Request , res: Response)=>{
    const signupverify = signupSchema.safeParse(req.body);
    if (!signupverify.success){
        return ferr("INVALID INPUTS" , 401, res);
    }
    const usercheck = await 
})

app.listen(3000);