"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executer = void 0;
const User_model_1 = require("../models/User.model");
const generateFile_1 = require("./generateFile");
const execute_1 = require("../executer/execute");
const execute_2 = require("../executer/execute");
const Executer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { language, code } = req.body;
    let output = null;
    try {
        const user = User_model_1.User.findById(req.user._id);
        if (language && code && user) {
            const filepath = yield (0, generateFile_1.generateFile)(language, code);
            if (filepath) {
                switch (language) {
                    case "cpp":
                        output = yield (0, execute_1.runCPP)(filepath);
                        break;
                    case "py":
                        output = yield (0, execute_1.runPython)(filepath);
                        break;
                    case "js":
                        output = yield (0, execute_1.runJavaScript)(filepath);
                        break;
                    case "ts":
                        output = yield (0, execute_1.runTs)(filepath);
                        break;
                    case "c":
                        output = yield (0, execute_1.runC)(filepath);
                        break;
                    default:
                        res.status(400).json({ error: "language doesn't supported" });
                }
                if (output) {
                    yield (0, execute_2.deleteFilePromise)(filepath);
                    res.status(201).json({ language, output });
                }
                else {
                    res.status(400).json({ error: "something went wrong" });
                }
            }
        }
        else {
            res.status(400).json({ error: "language and code can't be empty" });
        }
    }
    catch (e) {
        console.log("error in run the code", e.message);
        res.status(500).json({ error: "internal server error" });
    }
});
exports.Executer = Executer;
