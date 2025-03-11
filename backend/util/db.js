import mongoose from 'mongoose'

const db = await mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log('Mongoose successfully Connected!'))
	.catch((error) => console.error('Error while connecting to database : ', error))

export default db;