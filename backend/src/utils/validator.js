const validator=require('validator')

const validate=(data)=>{
     const mandatoryField=['firstName',"emailId",'password'];
   const Isallowed=mandatoryField.every((k)=>Object.keys(data).includes(k));

   if(!Isallowed)
    throw new Error("some fields missing");

   if(!validator.isEmail(data.emailId))
    throw new Error("invalid email");
  
   if(!validator.isStrongPassword(data.password))
      throw new Error("weak password");
}
module.exports=validate;