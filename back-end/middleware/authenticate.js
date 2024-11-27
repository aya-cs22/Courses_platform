const jwt = require('jsonwebtoken');
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if(!authHeader){
    return res.status(401).json({ message : 'Authentication token required'});
  }
  const token = authHeader.replace('Bearer', '').trim();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user information in req.user
    next();
} catch (error) {
    res.status(401).json({ message: 'Invalid token' });
}
};
module.exports = authenticate;