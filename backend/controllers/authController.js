import userModel from "../models/userModel.js";
import db from "../util/db.js";
import jwt from 'jsonwebtoken'
import validator from 'validator'
import bcrypt from 'bcrypt'

const login = async (req, res) => {
	
	try {
		const { email, password } = req.body;

		// Check for required fields
		if (!(email && password)) {
			return res.send({ success: false, message: 'Please enter all of the required fields' });
		}

		// Checking if user already exists
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.send({ success: false, message: 'user not found' });
		}

		if (!validator.isEmail(email)) {
			return res.json({ success: false, message: 'Please enter a valid email' });
		}

		const isValid = await bcrypt.compare(password, user.password);

		
		if (isValid) {
			// Sign Jwt Token
			const token = jwt.sign({ user: user.email }, process.env.JWT_SECRET,  { expiresIn: '1h' });

			return res.json(
				{
					success: true,
					token: token, 
					user: user.email,
					message: 'Login Successful'
				}
			)
		}else{
			return res.json(
				{
					success: false,
					message: 'Invalid Password'
				}
			)
		}
		
	} catch (error) {
		console.log(error);
		
		return res.json(
			{
				success: false,
				message: 'Something went wrong, please try again later',
				error: error
			}
		)
	}

}

const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		console.log(name, email, password )

		const isValidEmail = (email) => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(email);
		  };

		// Check for required fields
		if (!email || !password) {
			return res.status(400).send({ success: false, message: "Please enter all required fields" });
		  }
		  
		  if (!isValidEmail(email)) {
			return res.status(422).send({ success: false, message: "Invalid email format" });
		  }
		  

		// Checking if user already exists
		const exists = await userModel.findOne({ email });
		if (exists) {
			return res.status(409).send({ success: false, message: 'user already exists' });
		}

		// validation
		if (!name || name.length < 3) {
			return res.json({ success: false, message: 'Name should be at least 3 characters long.' });
		}

		if (!validator.isEmail(email)) {
			return res.json({ success: false, message: 'Please enter a valid email' });
		}

		if (password.length < 8) {
			return res.json({ success: false, message: 'Password should be at least 8 characters long' });
		}

		// Hashing the password 
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new userModel(
			{
				name,
				email,
				password: hashedPassword
			}
		)

		const user = await newUser.save();
		return res.json(
			{
				success: true,
				message: 'Account Created Succesfully'
			}
		)

	} catch (error) {
		console.log(error);

		// Return a generic error message to the client 
		return res.status(500).json({
			success: false,
			message: 'An unexpected error occurred. Please try again later. :'.error,
		});
	}




}

export {
	login,
	register
}