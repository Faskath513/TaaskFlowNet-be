const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    console.log(req.headers); // Log the request headers to see the token
    const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with the secret
      req.user = { _id: decoded.id }; // Add decoded user info to the request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Error verifying token:', error); // Log the error for debugging
      res.status(401).json({ message: 'Invalid token.' }); // Send an invalid token response
    }
};


module.exports = {
  authenticateUser,
};
