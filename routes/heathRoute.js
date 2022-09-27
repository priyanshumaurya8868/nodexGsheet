import { Router } from "express";
const router = Router();
import * as controller from "../controller/healthController.js";

//...get :  /store?days=10&spreadsheetId=fdg324r2323r3323r&user=shreya#1231


router.post("/", controller.displayData);

router.get("/regU",controller.regUserRec )

router.get("/sync", controller.sync)

router.get('/temp', controller.temp)


export default router;
