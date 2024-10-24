import express from 'express';
import  {registerUser} from '../controllers/userController.js';
//import isAuthenticated from '../middlewaire/auth.js';






const userRoute = express.Router();


 userRoute.post('/registre', registerUser);
 /*userRouter.post('/verify-otp', verifyOtp);
 userRouter.post("/email-otp-request", sendingOtpToEmail);
 userRouter.put("/email-otp-verify", verifyingEmail);
 userRouter.get("/me", isAuthenticated, getLoggedInUserData);
 userRouter.get("/get-rides", isAuthenticated, getAllRides);*/



export default userRoute;