import express from 'express'
import { login, register } from '../controller/authController.js';

const authRoute = express.Router();

authRoute.post('/register', register)

authRoute.post('/login', login)

authRoute.post('/logout', (req, res)=>{
	res.send('logout');
})

export default authRoute;