import express from 'express';
import  {registerUser, login} from '../controllers/userCtrl.js';
//import isAuthenticated from '../middlewaire/auth.js';
import { authenticateJWT } from '../middlewares/authenticate.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userCtrl.js';





const userRoute = express.Router();


 userRoute.post('/registre', registerUser);
 userRoute.post('/login', login);
 /*userRouter.post('/verify-otp', verifyOtp);
 userRouter.post("/email-otp-request", sendingOtpToEmail);
 userRouter.put("/email-otp-verify", verifyingEmail);
 userRouter.get("/me", isAuthenticated, getLoggedInUserData);
 userRouter.get("/get-rides", isAuthenticated, getAllRides);*/

//modif #################################

userRoute.get('/',authenticateJWT, getAllUsers)
userRoute.get('/:id', getUserById)
userRoute.put('/:id', updateUser)
userRoute.delete('/:id', deleteUser)

export default userRoute;