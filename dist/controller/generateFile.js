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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const cDir = path_1.default.join(__dirname, "..", "runtime");
if (!fs_1.default.existsSync(cDir)) {
    fs_1.default.mkdirSync(cDir, { recursive: true });
}
const generateFile = (language, code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobid = (0, uuid_1.v4)();
        const filename = `${jobid}.${language}`;
        const filepath = path_1.default.join(cDir, filename);
        yield fs_1.default.promises.writeFile(filepath, code);
        return filepath;
    }
    catch (error) {
        console.error("Error generating file:", error);
        throw new Error("Failed to generate file");
    }
});
exports.generateFile = generateFile;
