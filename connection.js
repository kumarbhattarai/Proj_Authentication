const mongoose=require('mongoose')
async function connection (url){
 await mongoose.connect(url)
 .then(()=>
    console.log('Connected to database')
 )
 .catch((err)=>err
)  }
module.exports=connection