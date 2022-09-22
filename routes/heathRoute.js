import { Router } from "express";
const router = Router();
import * as controller from "../controller/healthController.js";

//...POST :  /store?days=10&spreadsheetId=fdg324r2323r3323r&user=shreya#1231
router.get("/store", controller.storeData);

router.get("/", controller.displayData);
export default router;
