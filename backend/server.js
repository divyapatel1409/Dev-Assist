import 'dotenv/config'
import express from 'express';
import authRoute from './routes/authRoute.js';
import collectionRoute from './routes/collectionRoute.js';
import envRoute from './routes/envRoute.js';
import db from './util/db.js'
import { verifyToken } from './middlewares/authMiddleware.js';
import apiRequestRoute from './routes/apiRequestRoutes.js';
import cors from 'cors';
import regexRoutes from "./routes/regexRoute.js";


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

app.use("/api", regexRoutes);
app.use('/api',  verifyToken, apiRequestRoute);
app.use('/api', verifyToken, envRoute);
app.use('/api', verifyToken, collectionRoute);
// app.use('/api', verifyToken, apiRequestRoute);