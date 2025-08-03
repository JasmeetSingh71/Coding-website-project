const User=require("../models/user")
const validate=require('../utils/validator')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


const register=async(req,res)=>{
    try{
        //validate the data first:
         validate(req.body);
         const{firstName,emailId,password}=req.body;

         // user.exist(emailId) you can check this but already defined in schema
         req.body.password=await bcrypt.hash(password,10);


        
          const user=await User.create(req.body);
          const token=jwt.sign({_id:user._id,emailId:emailId},process.env.JWT_KEY,{expiresIn:60*60});

          res.cookie('token',token,{maxAge: 60*60*1000})
          res.status(201).send("user registered successfully");
    }
    catch(err){
       res.status(400).send("error: "+err);
    }
}

const login=async(req,res)=>{
    try{
        const{emailId,password}=req.body;

        if(!emailId)
            throw new Error("invalid credentials");
        if(!password)
            throw new Error("invalid credentials");
          const user= await User.findOne({emailId});

         const match= await bcrypt.compare(password,user.password);

         if(!match)
            throw new Error("invalid creddentials");

         const token=jwt.sign({_id:user._id,emailId:emailId},process.env.JWT_KEY,{expiresIn:60*60});

          res.cookie('token',token,{maxAge: 60*60*1000});
          res.status(200).send("login successfully")


    }
    catch(err){
      res.status(401).send("Error: "+err);
    }
}

//logout feature

const logout=async(req,res)=>{
    try{
          
    }
    catch(err){

    }
}


module.exports={register,login};