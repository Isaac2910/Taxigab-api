import express from 'express';
import {createDriver, getAllDrivers, getDriverById, updateDriver, deleteDriver} from '../controllers/drivecrtl.js';
import {authenticateJWT }from '../middlewares/authenticate.js'

const route = express.Router();

route.post('/', authenticateJWT, createDriver); 
route.get('/', authenticateJWT, getAllDrivers); 
route.get('/:id', authenticateJWT, getDriverById);
route.put('/:id', authenticateJWT, updateDriver); 
route.delete('/:id', authenticateJWT, deleteDriver); 

export default route