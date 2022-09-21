import { Router } from "express";
const router = Router();
import {
  getCurrentDay,
  sendDataToDB,
  temp,
} from "../controller/healthController.js";

router.get("/display", getCurrentDay);

//...POST :  /send?timestamp=Sep-21-22&spreadsheetId=fdg324r2323r3323r
router.post("/send", sendDataToDB);

router.get("/", temp);
export default router;
