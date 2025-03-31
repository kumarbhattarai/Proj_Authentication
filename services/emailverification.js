const nodemailer = require("nodemailer");
const express = require("express");
require("dotenv").config();
const User = require("../models/user");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "eureshbhattarai666@gmail.com",
    pass: process.env.PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email,code) {
  // send mail with defined transport object
  try{
  const info = await transporter.sendMail({
    from: '"Kumar Bhattarai" <eureshbhattarai666@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "verify", // Subject line
    text: `your verification code is ${code}`, // plain text body
    html: `<b>This is your verification code ${code} </b>`, // html body
  });
  // console.log("Message sent: %s", info.messageId);
  alert("Verification code sent to your email");
}
catch(err){
    // console.log(err)  
}
}
module.exports={
  sendMail,
}