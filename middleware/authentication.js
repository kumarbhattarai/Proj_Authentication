const { verifyToken } = require("../services/authentication");

function checkforToken(cookieName) {
    return (req,res,next)=>{
 
  const token = req.cookies[cookieName];
  if (!token) {
    req.user=null;
    return next();
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
}
module.exports = {
    checkforToken,
};