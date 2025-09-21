const express=require('express')
const app=express();
require('dotenv').config();
const main=require('./config/db')
const cookieParser=require('cookie-parser')
const authRouter = require('./routes/userAuthentication');
const redisClient=require('./config/redis')
const problemRouter=require('./routes/problemCreater')
const submitRouter=require('./routes/submit')
const aiRouter=require('./routes/aiChatting')
const cors=require('cors');


app.use(cors({
origin:'http://localhost:5173',
credentials:true
}

))


app.use(express.json());
app.use(cookieParser())

app.use('/user', authRouter);
app.use('/problem', problemRouter);

app.use('/submission',submitRouter);
app.use('/ai',aiRouter);


const InitializeConnection=async()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("db connected");
        app.listen(7001,()=>{
        console.log("server listening at port number: "+process.env.PORT)
          })

    }
    catch(err){
        console.log("Error "+err);
    }
}

InitializeConnection();

