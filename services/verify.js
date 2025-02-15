const User = require('../models/user');
const { sendMail } = require('./emailverification');
async function verify(email,code) {
const user= await User.findOne({email:email})
if(!user){
    return {message:"User not found"}

}
if (user.verificationcode === code) {
    await User.updateOne(
        { email },
        { $set: { isverified: true, verificationcode: null } }
    );
    console.log('User verified');
    return true; 
}
else{
    console.log('Incorrect verification code');
    return false;
}
}
module.exports=verify