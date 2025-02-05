import { spawn } from "child_process";
import fs, { unlink } from "fs";
import path from "path";
const cDir = path.join(__dirname, "../..", "runtime");
if (!fs.existsSync(cDir)) {
    fs.mkdirSync(cDir, { recursive: true });
}
interface data {
    filepath: string,
    inputFile: string | undefined
}

// run the python program
export const runPython = (file:data): Promise<string> => {
    const { filepath, inputFile } = file;
    return new Promise((resolve, reject) => {
        try {
            const command = spawn('python', [filepath]);
            let input: string = '';
            if (inputFile) {
                input = fs.readFileSync(inputFile, 'utf8');
            }
            command.stdin.write(input);
            command.stdin.end();
            let stdout = '';
            let stderr = '';
            command.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            command.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            command.on('close', (code) => {
                if (code !== 0) {
                    reject(`Execution error: ${stderr}`);
                } else {
                    resolve(stdout);
                }
            });

        } catch (error: any) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};

// run the javascript program
export const runJavaScript = (file:data): Promise<string> => {
    const { filepath, inputFile } = file;
    return new Promise((resolve, reject) => {
        try {
            const command = spawn('node', [filepath]);
            let input: string = '';
            if (inputFile) {
                input = fs.readFileSync(inputFile, 'utf8');
            }
            command.stdin.write(input);
            command.stdin.end();
            let stdout = '';
            let stderr = '';
            command.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            command.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            command.on('close', (code) => {
                if (code !== 0) {
                    reject(`Execution error: ${stderr}`);
                } else {
                    resolve(stdout);
                }
            });
        } catch (error: any) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};

// run the cpp program
export const runCPP = (file: data): Promise<string> => {
    const { filepath, inputFile } = file
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(cDir, `${jobId}.out`);
    return new Promise((resolve, reject) => {
        try {
            const compile = `g++ ${filepath} -o ${outPath}`;
            const runCommand = inputFile ? `${outPath} < ${inputFile}` : outPath;
            const compilePro = spawn(compile, { cwd: cDir, shell: true });
            compilePro.stderr.on('data', (data) => {
                reject(`Error compiling C++ program: ${data}`);
            });
            compilePro.on('close', (code) => {
                if (code !== 0) {
                    reject(`Error compiling C++ program: ${code}`);
                } else {
                    const run = spawn(runCommand, { cwd: cDir, shell: true });
                    let output = '';
                    run.stdout.on('data', (data) => {
                        output += data.toString();
                    });
                    run.stderr.on('data', (data) => {
                        reject(`Error running C++ program: ${data}`);
                    });
                    if (!inputFile) {
                        run.stdin.end();
                    }
                    run.on('close', async (code) => {
                        if (code !== 0) {
                            reject(`Error running C++ program: ${code}`);
                        } else {
                            resolve(output);
                            await deleteFilePromise(outPath);
                        }
                    });
                }
            });
        } catch (error: any) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};
// run the typescript program
export const runTs = (file: data): Promise<string> => {
    const { filepath, inputFile } = file
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(cDir, `${jobId}.js`);
    return new Promise((resolve, reject) => {
        try {
            const compilets = `tsc ${filepath}`;
            const compileCmd = spawn(compilets, { cwd: cDir, shell: true });
            compileCmd.stderr.on('data', (data) => {
                reject(`Error compiling TypeScript program: ${data}`);
            });
            compileCmd.on('close', (code) => {
                if (code !== 0) {
                    reject(`Error compiling TypeScript program: ${code}`);
                } else {
                    const runCommand = `node ${outPath}`;
                    const runts = spawn(runCommand, { cwd: cDir, shell: true });
                    let output = '';
                    runts.stdout.on('data', (data) => {
                        output += data.toString();
                    });
                    runts.stderr.on('data', (data) => {
                        reject(`Error running TypeScript program: ${data}`);
                    });
                    if (inputFile) {
                        const inputFileStream = fs.createReadStream(inputFile);
                        inputFileStream.pipe(runts.stdin);
                    } else {
                        runts.stdin.end();
                    }
                    runts.on('close', (code) => {
                        if (code !== 0) {
                            reject(`Error running TypeScript program: ${code}`);
                        } else {
                            resolve(output);
                            deleteFilePromise(outPath);
                        }
                    });
                }
            });
        } catch (error: any) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};

// run the c program
export const runC = (file: data): Promise<string> => {
    const { filepath, inputFile } = file
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(cDir, `${jobId}.out`);
    return new Promise((resolve, reject) => {
        try {
            const compileC = `gcc ${filepath} -o ${outPath}`;
            const runCommand = inputFile ? `${outPath} < ${inputFile}` : outPath;
            const compileCmd = spawn(compileC, { cwd: cDir, shell: true });
            compileCmd.stderr.on('data', (data) => {
                reject(`Error compiling C++ program: ${data}`);
            });
            compileCmd.on('close', (code) => {
                if (code !== 0) {
                    reject(`Error compiling C++ program: ${code}`);
                } else {
                    const runProcess = spawn(runCommand, { cwd: cDir, shell: true });
                    let output = '';
                    runProcess.stdout.on('data', (data) => {
                        output += data.toString();
                    });
                    runProcess.stderr.on('data', (data) => {
                        reject(`Error running C++ program: ${data}`);
                    });
                    if (!inputFile) {
                        runProcess.stdin.end();
                    }
                    runProcess.on('close', async (code) => {
                        if (code !== 0) {
                            reject(`Error running C++ program: ${code}`);
                        } else {
                            resolve(output);
                            await deleteFilePromise(outPath);
                        }
                    });
                }
            });
        } catch (error: any) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};

// run the java program
export const runJava = (filepath: { jobid: string, filename: string, className: string, inputFile: string | undefined}) => {
    const { jobid, filename, className, inputFile } = filepath;
    const newDir = path.join(__dirname, "../../runtime", jobid);
    return new Promise((resolve, reject) => {
        try {
            const compileJava = `javac ${filename}`;
            const compileProcess = spawn(compileJava, { cwd: newDir, shell: true });
            compileProcess.stderr.on('data', (data) => {
                reject(`Error compiling Java program: ${data}`);
            });
            compileProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(`Error compiling Java program: ${code}`);
                } else {
                    const runCommand = `java ${className}`;
                    const runProcess = spawn(runCommand, { cwd: newDir, shell: true });
                    let output = '';
                    runProcess.stdout.on('data', (data) => {
                        output += data.toString();
                    });
                    runProcess.stderr.on('data', (data) => {
                        reject(`Error running Java program: ${data}`);
                    });
                    if (inputFile) {
                        const inputFileStream = fs.createReadStream(inputFile);
                        inputFileStream.pipe(runProcess.stdin);
                    } else {
                        runProcess.stdin.end();
                    }
                    runProcess.on('close', (code) => {
                        if (code !== 0) {
                            reject(`Error running Java program: ${code}`);
                        } else {
                            resolve(output);
                            deleteDirPromise(newDir);
                        }
                    });
                }
            });
        } catch (error: any) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};

// delte the file
export const deleteFilePromise = (filepath: string) =>
    new Promise((resolve, reject) => {
        try {
            unlink(filepath, (err) => {
                if (err) reject(err);
                resolve(filepath)
            });
        }
        catch (e: any) {
            console.log("error in deleting the file", e.message)
        }
    });

// delete the directory
export const deleteDirPromise = (filepath: any) =>
    new Promise((resolve, reject) => {
        try {
            fs.rm(filepath, { recursive: true, force: true }, err => {
                if (err) reject(err);
                else resolve(filepath);
            })
        }
        catch (e: any) {
            console.log("error in deleting the dir", e.message)
        }
    });