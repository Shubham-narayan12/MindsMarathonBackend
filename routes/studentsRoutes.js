import express from "express"
import { studentLoginController, studentLogoutController, studentRegistrationController } from "../controllers/studentController.js";


const router = express.Router();


//STUDENT REGISTER 
router.post("/registration",studentRegistrationController);

//STUDENT LOGIN
router.post("/login",studentLoginController);

//STUDENT LOGOUT
router.get("/logout",studentLogoutController);


export default router;
