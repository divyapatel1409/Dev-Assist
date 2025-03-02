import express from 'express';
import authRoute from './routes/authRoute.js';
import db from './util/db.js'
import 'dotenv/config'
import { verifyToken } from './middleware/authMiddleware.js';
import cors from 'cors';


const app = express();

app.use(cors());

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

