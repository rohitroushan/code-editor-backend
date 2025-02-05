import { Response } from "express";
let istwopublic = /public\s+class\s+(\w+)/g;
import { generateJavaFile } from "./generateFile";
let isClass = /class\s+(\w+)/
const isJava = async (code:string,userInput:string|undefined,res:Response)=>{
    try{
        if(code){
            let isMorePublicClass = code.match(istwopublic);
            let fileName;
            if(isMorePublicClass){
                if(isMorePublicClass.length > 1){
                    let howmuch:string = '';
                    for (let i = 0; i < isMorePublicClass.length; i++) {
                     let whichadd:string = " and ";
                     if(isMorePublicClass.length == i+1){
                         whichadd = " "
                     } 
                     howmuch += isMorePublicClass[i] + whichadd
                   }
                   res.status(400).json({error:`${howmuch} found ${isMorePublicClass.length} public class in same file`})
                 }
                 else{
                        fileName  = isMorePublicClass[0].split(" ")[2];
                 }
            } 
            else{
                let isTwoClass = code.match(isClass);
                if(isTwoClass) fileName  = isTwoClass[1];
            }   
            if(fileName){
                return await generateJavaFile(fileName,code,userInput)
            }       
        }
    }
    catch(e:any){
        console.log("somehting happen wrong")
    }
}
export {isJava}