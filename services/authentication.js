const jwt=require('jsonwebtoken');
const secret= process.env.SECRET
// const User = require('../models/user')
function generateToken(User){

const payload={
    id:User._id,
    name:User.name,
    email:User.email,
    password:User.password,
}

const token=jwt.sign(payload,secret,{expiresIn:'10d'})
return token;
console.log(token)
}
function verifyToken(token){
    if(!token){
        return res.status(401).send('Token not found')
    }
    // jwt.verify(token,secret,(err,user)=>{
    //     if(err){
    //         return res.status(401).send('Invalid token')
    //     }
    //     req.user=user
    //     next()
    const payload=jwt.verify(token,secret)
return payload
    }
    module.exports={generateToken,verifyToken}
