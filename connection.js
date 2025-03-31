const mongoose=require('mongoose')
async function connection (url){
   console.log('Connecting to database...')
 await mongoose.connect(url)
 .then(()=>
    console.log('Connected to database')
 )
 .catch((err)=>err
)  }
module.exports=connection