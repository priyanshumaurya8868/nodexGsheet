import { Router } from "express";
const router = Router();
import * as controller from "../controller/healthController.js";

//...get :  /store?days=10&spreadsheetId=fdg324r2323r3323r&user=shreya#1231
router.get("/store", controller.storeData);

router.get("/", controller.displayData);

router.get("/sync", controller.sync)


export default router;
