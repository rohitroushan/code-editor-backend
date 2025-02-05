import  {sign} from 'jsonwebtoken';
require('dotenv').config()
import { Response } from 'express';
export const generateToken = async ({userid,res}:{userid:any,res:Response})=>{
    const jwtToken:(string|undefined) = process.env.JWT_TOKEN;
    if(jwtToken){
        const token = await sign({userid},jwtToken,{
            expiresIn:'20d',
          })
          res.cookie("rck",token,{
            maxAge: 20* 24 * 60 * 60 * 1000,
            httpOnly:true,
            sameSite:"strict",
            secure:false
          })
    }
  
}
