import express from 'express'
import { login, register } from '../controllers/authController.js';

const authRoute = express.Router();

authRoute.post('/register', register)

authRoute.post('/login', login)

authRoute.post('/logout', (req, res)=>{
	res.send('logout');
})

export default authRoute;