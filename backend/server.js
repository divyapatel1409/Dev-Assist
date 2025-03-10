import 'dotenv/config'
import express from 'express';
import authRoute from './routes/authRoute.js';
import envRoute from './routes/envRoute.js';
import db from './util/db.js'
<<<<<<< Updated upstream
import { verifyToken } from './middleware/authMiddleware.js';
=======
import { verifyToken } from './middlewares/authMiddleware.js';
import cors from 'cors';

>>>>>>> Stashed changes

const app = express();

app.use(express.json())

console.log(process.env.PORT);

const port = process.env.PORT || 5000;


app.listen(port, ()=>{
	console.log('App is listening on ' + port)
})

app.get('/', (req, res)=>{
	res.send('Welcome to backend Api')
})

app.get('/private', verifyToken, (req, res)=>{
	return res.send('You are now visiting the private page')
})

// Auth Routes
app.use('/api', authRoute);
app.use('/api', verifyToken, envRoute);

