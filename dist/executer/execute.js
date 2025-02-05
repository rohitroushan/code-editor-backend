"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFilePromise = exports.runC = exports.runTs = exports.runCPP = exports.runJavaScript = exports.runPython = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const cDir = path_1.default.join(__dirname, "..", "runtime");
if (!fs_1.default.existsSync(cDir)) {
    fs_1.default.mkdirSync(cDir, { recursive: true });
}
// run the python code
const runPython = (filepath) => {
    return new Promise((resolve, reject) => {
        try {
            (0, child_process_1.exec)(`python ${filepath}`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Execution error: ${stderr}`);
                }
                else {
                    resolve(stdout);
                }
            });
        }
        catch (error) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};
exports.runPython = runPython;
// run the javascript
const runJavaScript = (filepath) => {
    return new Promise((resolve, reject) => {
        try {
            (0, child_process_1.exec)(`node ${filepath}`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Execution error: ${stderr}`);
                }
                else {
                    resolve(stdout);
                }
            });
        }
        catch (error) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};
exports.runJavaScript = runJavaScript;
// run the cpp 
const runCPP = (filepath) => {
    const jobId = path_1.default.basename(filepath).split(".")[0];
    const outPath = path_1.default.join(cDir, `${jobId}.out`);
    return new Promise((resolve, reject) => {
        try {
            (0, child_process_1.exec)(`g++ ${filepath} -o ${outPath} && cd ${cDir} && ./${jobId}.out`, (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    reject(`Execution error: ${stderr}`);
                }
                else {
                    console.log(stdout);
                    resolve(stdout);
                    try {
                        // delete the output file having .out extension
                        yield (0, exports.deleteFilePromise)(outPath);
                    }
                    catch (error) {
                        console.error(`Error deleting file: ${error.message}`);
                    }
                }
            }));
        }
        catch (error) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};
exports.runCPP = runCPP;
// run the typescript file
const runTs = (filepath) => {
    console.log(filepath);
};
exports.runTs = runTs;
const runC = (filepath) => {
    const jobId = path_1.default.basename(filepath).split(".")[0];
    const outPath = path_1.default.join(cDir, `${jobId}.out`);
    return new Promise((resolve, reject) => {
        const cProcess = (0, child_process_1.exec)(`gcc ${filepath} -o ${outPath} && cd ${cDir} &&  ${jobId}.out`, (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                reject(error);
            }
            else {
                resolve(stdout);
                yield (0, exports.deleteFilePromise)(outPath);
            }
        }));
    });
};
exports.runC = runC;
const deleteFilePromise = (filepath) => new Promise((resolve, reject) => {
    (0, fs_1.unlink)(filepath, (err) => {
        if (err)
            reject(err);
        else
            resolve(filepath);
    });
});
exports.deleteFilePromise = deleteFilePromise;
