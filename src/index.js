const express=require('express')
const app=express();
require('dotenv').config();
const main=require('./config/db')
const cookieParser=require('cookie-parser')
const authRouter = require('./routes/userAuthentication');



app.use(express.json());
app.use(cookieParser())

app.use('/user', authRouter);



main().then(async()=>{
app.listen(6001,()=>{
    console.log("server listening at port number: "+process.env.PORt);
})
})
.catch(error=>console.log("error occured"+error))
