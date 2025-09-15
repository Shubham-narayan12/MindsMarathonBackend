import express from "express"
import { schoolLoginController, schoolLogout, schoolRegistrationController } from "../controllers/schoolControllers.js";



//routes object
const router = express.Router();


//SCHOOL REGISTER 
router.post("/registration",schoolRegistrationController);

//SCHOOL LOGIN
router.post("/login",schoolLoginController);

//SCHOOL LOGOUT
router.get("/logout",schoolLogout);



export default router;
