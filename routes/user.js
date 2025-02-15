const express=require('express')
const User = require('../models/user')
const router=express.Router()
const { createHmac } = require('crypto');
const {generateToken}=require('../services/authentication');
const { render } = require('ejs');
const { sendMail } = require('../services/emailverification');
const verify = require('../services/verify');
// const token=require('../services/authentication')
router.post('/register',async(req,res)=>{
    const {name,email,password}=req.body
    if(!name||!email||!password){
        return res.status(404).send('Please enter all the fields')
    }
    const existingUser=await User.findOne({email:req.body.email})
    if(existingUser){
        return res.status(404).send('User already exists. Sign in instead')
    }

    try{
        const user=await User.create({
                name,
                email,
                password,
            })
            const code=Math.floor(1000 + Math.random() * 9000).toString()
            user.verificationcode=code
            await user.save()
            
            sendMail(email,code)
            console.log('mail sent')
            // verify(email,code)
            // console.log(user)
            res.redirect(`/user/verify?email=${encodeURIComponent(email)}`);
            
    }
    catch(err){
        console.log(err)
        return res.status(404).send('Error'+err)
        
    }
})
router.post('/forgotpassword',async(req,res)=>{
    const {name,email}=req.body
    if(!name||!email){
        return res.status(404).send('Please enter email')
    }
    try{
        const user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).send('User not found')
        }
            const code=Math.floor(1000 + Math.random() * 9000).toString()
        await User.updateOne(
            {email},
            {$set:{verificationcode:code,isverified:false}}

        )
        sendMail(email,code)
        res.redirect(`/user/resetpassword?email=${encodeURIComponent(email)}`)

//         if(user.verificationcode===verificationcode){
//             user.isverified=true
//             await user.save()
//             return res.redirect('/user/login')
//         }
//         else{
//             return res.status(404).send('Incorrect verification code')
//         }
    }
    catch(err){
        return res.status(404).send('Error'+err)
    }
})
router.post('/verify',async(req,res)=>{

    const {email,verificationcode}=req.body
    console.log(email)
    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).send('User not found')
        }
        // if(!user.isverified){
        //     return res.status(404).send('User already verified')
        // }
        const verified= await verify(email,verificationcode)
        console.log(verified)
        if(verified===true){
            console.log('verify')
        return res.redirect('/user/login')
        
        }
        else{
            return res.send('Verification code sent to your email. Please verify')
        }
    }
    catch(err){
        return res.status(404).send('Error'+err)
    }
})
router.post('/resetpassword',async(req,res)=>{
    const {email,verificationcode}=req.body
   
    try{
        const user=await User.findOne({email:email})
        if(!user){
            return res.status(404).send('User not found')
        }
        // if(!user.isverified){
        //     return res.status(404).send('User already verified')
        // }
        const verified= await verify(email,verificationcode)
        if(verified===true){
        return res.redirect(`/user/setpassword?email=${encodeURIComponent(email)}`)
        }
        else{
            return res.send('Verification code sent to your email. Please verify')
        }
    }
    catch(err){
        return res.status(404).send('Error'+err)
    }
})
router.post('/setpassword',async(req,res)=>{

    const {email,password}=req.body
    if(!email){
        return res.status(500).send('Internal server error')
    }
    try{
        const user=await User.findOne({email:email})
        if(!user){
            return res.status(404).send('User not found')
        }
        user.password=password
        await user.save()
        
        res.redirect('/user/login')
//         if(user.verificationcode===verificationcode){
//             user.isverified=true
//             await user.save()
//             return res.redirect('/user/login')
//         }
//         else{
//             return res.status(404).send('Incorrect verification code')
//         }
    }
    catch(err){
        return res.status(404).send('Error'+err)
    }
})
router.post('/login',async(req,res)=>{
    console.log('login')
     const {email,password}=req.body
    try{
        const user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).send('User not found')
        }
const hash = createHmac('sha256', user.salt)
               .update(password)
               .digest('hex');
if(hash===user.password){
    // console.log(hash)
    const token=generateToken(user)
    res.cookie('token',token).render('./partials/info',{
        user:user
    })
    // console.log(token)
    return
}
else{
    return res.status(404).send('Incorrect password')
}
    }
    catch(err){
        return res.status(404).send('Error'+err)
    }
})
router.get('/resetpassword',(req,res)=>{
    res.render('reset',{
        email:req.query.email
    })
})
router.get('/verify',(req,res)=>{
    res.render('verify',{
        email:req.query.email
    })
})
router.get('/forgotpassword',(req,res)=>{
    res.render('forgot')
})
router.get('/')
router.get('/logout',(req,res)=>{
    console.log('logout')
    res.clearCookie('token').redirect('/user/login');
})
router.get('/login',(req,res)=>{
    res.render('signin')
})
router.get('/register',(req,res)=>{
    res.render('signup')})
router.get('/setpassword',(req,res)=>{
    res.render('setpassword',{
        email:req.query.email
    })
})
module.exports=router