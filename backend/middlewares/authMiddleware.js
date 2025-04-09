import jwt from 'jsonwebtoken'
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ success: false, message: 'Access denied! Token not found' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    
    if (decoded) {
			req.user = decoded; // Make sure your token contains userId (e.g., {_id, email})
			console.log(decoded)
      next();
    } else {
      return res.status(401).json({ success: false, message: 'Token expired, please login again' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export {
	verifyToken
}