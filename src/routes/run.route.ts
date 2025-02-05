import {Router} from "express";
import { Executer } from "../controller/run.controller";
const router = Router()
router.post("/",Executer);
export default router;