
import express from 'express'
import { orderRide} from "../controllers/ridectrl.js";


const rideroute = express.Router();


rideroute.post('/', orderRide);




export default rideroute