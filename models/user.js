const mongoose = require('mongoose');
// const exp = require('node:constants');
const { createHmac } = require('node:crypto');
const { randomBytes } = require('node:crypto');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    // required: true
  },
  isverified: {
    type: Boolean,
    default: false
  },
  verificationcode: {
    type: String,
  },
} , {timestamps: true});
userSchema.pre('save', function(next) {
  const user = this;
if(!user.isModified('password')) {
  console.log('Password not modified');
    return next();
}

const salt = randomBytes(32).toString('hex');
const hash = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');
this.salt = salt;  
this.password = hash;
console.log(hash);
next();

})

const User = mongoose.model('user', userSchema);
module.exports = User;