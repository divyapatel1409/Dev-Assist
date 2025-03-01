import mongoose from 'mongoose'

const db = await mongoose.connect("mongodb+srv://lsdhillon6375:lsdhillon6375@week2assignment.bnvejrm.mongodb.net/capstone")
	.then(() => console.log('Mongoose successfully Connected!'))
	.catch((error) => console.error('Error while connecting to database : ', error))

export default db;