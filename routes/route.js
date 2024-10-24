import express from 'express';
import {
    getAllRides,
    getLoggedInUserData,
    registerUser,
    sendingOtpToEmail,
    verifyingEmail,
    verifyOtp,
} from '../controllers/controller.js';
import {isAuthenticated} from '../middlewaire/auth.js';






const userRouter = express.Router ();


 userRouter.post('/ registre', registerUser);
 userRouter.post('/verify-otp', verifyOtp);
 userRouter.post("/email-otp-request", sendingOtpToEmail);
 userRouter.put("/email-otp-verify", verifyingEmail);
 userRouter.get("/me", isAuthenticated, getLoggedInUserData);
 userRouter.get("/get-rides", isAuthenticated, getAllRides);



export default userRouter;