import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const cDir = path.join(__dirname, "../..", "runtime");


if (!fs.existsSync(cDir)) {
  fs.mkdirSync(cDir, { recursive: true });
}
const generateFile = async (language: string, code: string, input: string | undefined): Promise<{ filepath: string, inputFile: string | undefined }> => {
  try {
    let inputFile;
    const jobid = uuidv4();
    const filename = `${jobid}.${language}`;
    if (input){
       inputFile  = path.join(cDir, `${jobid}.text`);
      await fs.promises.writeFile(inputFile, input);
    }
    const filepath = path.join(cDir, filename);
    await fs.promises.writeFile(filepath, code);
    return { filepath, inputFile };
  } catch (error) {
    throw new Error("Failed to generate file");
  }
}

const generateJavaFile = async (name: string, code: string,input:string|undefined) => {
  try {
    const jobid = uuidv4();
    let inputFile;
    const cDirs = path.join(__dirname, "../../runtime", jobid);
    fs.mkdirSync(cDirs, { recursive: true });
    const filename = `${name}.java`;
    if(input){
      inputFile = path.join(cDirs, `${jobid}.text`)
      await fs.promises.writeFile(inputFile, input);
    }
    const newfilepath = path.join(cDirs, filename);
    await fs.promises.writeFile(newfilepath, code);
    return { jobid, filename, className: name,inputFile};
  } catch (error) {
    console.error("Error generating file:", error);
    throw new Error("Failed to generate file");
  }
}

export { generateFile, generateJavaFile };
