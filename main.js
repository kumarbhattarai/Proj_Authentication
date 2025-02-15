const express=require('express')
const connection=require('./connection')
const User=require('./routes/user')
const cookieParser=require('cookie-parser')
const path=require('path')
const { checkforToken } = require('./middleware/authentication')
require('dotenv').config()
const PORT=3000;
const app=express();


connection ("mongodb://localhost:27017/authentication")
app.use(cookieParser())
app.use(checkforToken('token'))
app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get('/',(req,res)=>{
res.render('signin')
})
app.use('/user',User)   

app.listen(PORT,()=>{
    console.log('listening to port '+PORT)
})