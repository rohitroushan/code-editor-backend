"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_1 = require("../middleware/token");
const run_controller_1 = require("../controller/run.controller");
// import { Executer } from "../controller/run.controller";
const router = (0, express_1.Router)();
router.post("/", token_1.protectRoute, run_controller_1.Executer);
exports.default = router;
