"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const run_route_1 = __importDefault(require("./routes/run.route"));
const config_1 = require("./db/config");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
require('dotenv').config();
exports.app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
exports.app.use(body_parser_1.default.json({ limit: '50mb' }));
exports.app.use((0, cors_1.default)({ origin: process.env.CLIENT, credentials: true }));
exports.app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use("/auth", auth_route_1.default);
exports.app.use("/run", run_route_1.default);
exports.app.get("/", (req, res) => {
    console.log(req.cookies);
    res.send("Hello frorrftfygm Express + TypeScript server!");
});
exports.app.listen(PORT, () => {
    (0, config_1.connectToDb)();
    console.log(`Server is running at ${PORT} hhg`);
});
