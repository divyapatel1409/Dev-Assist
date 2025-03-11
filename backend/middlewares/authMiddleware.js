import jwt from 'jsonwebtoken'
const verifyToken = (req, res, next)=>{
	const token = req.header('Authorization');
	console.log(token);
	
	if(!token) return res.status(401).json({success: false, message: 'Access denied! Token not found'})

	try {
		const isValid = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
		console.log(isValid);
		
		if(isValid){
			next();
		}else{
			return res.status(401).json({success: true, message: 'Token Expired, please login again'})
		}
	} catch (error) {
		console.log(error);
		
		return res.status(500).json({success: false, message: error.message})
	}
}

export {
	verifyToken
}