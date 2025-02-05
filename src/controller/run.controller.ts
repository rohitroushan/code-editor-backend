import { Response, Request } from "express";
import { generateFile } from "./generateFile";
import { isJava } from "./checkjava";
import { runCPP, runJavaScript, runPython, runTs, runC, runJava } from "../executer/execute";
import { deleteFilePromise } from "../executer/execute";
interface lanType {
    language: string | undefined,
    code: string | undefined,
    userInput: string | undefined
}

const Executer = async (req: Request, res: Response) => {
    const { language, code, userInput }: lanType = req.body;
    let filepath: any;
    let output = null;
    try {
        if (language && code) {
            if (language === "java") {
                filepath = await isJava(code, userInput, res);
            }
            else {
                filepath = await generateFile(language, code, userInput)
            }

            if (filepath) {
                switch (language) {
                    case "cpp":
                        output = await runCPP(filepath);
                        break;
                    case "py":
                        output = await runPython(filepath);
                        break;
                    case "js":
                        output = await runJavaScript(filepath);
                        break;
                    case "ts":
                        output = await runTs(filepath);
                        break;
                    case "c":
                        output = await runC(filepath);
                        break;
                    case "java":
                        output = await runJava(filepath);
                        break;
                    default:
                        res.status(400).json({ error: "language doesn't supported" })
                }
                if (output) {
                    res.status(201).json({ language, output })
                }
                
                else {
                    console.log(output)
                    res.status(400).json({ error: "something went wrong" })
                }
               
            }
        }
        else {
            res.status(400).json({ error: "language and code can't be empty" })
        }
    }
    catch (e: any) {
        console.log("error in run the code", e.error)
        res.status(500).json({ error: e })
    }
    finally {
        if (filepath && language != "java") await deleteFilePromise(filepath.filepath);
        if (userInput) await deleteFilePromise(filepath.inputFile);
    }
}


export { Executer }