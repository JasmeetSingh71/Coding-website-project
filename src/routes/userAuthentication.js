const express=require('express');
const authRouter=express.Router();

const {register,login,logout,adminRegister}=require('../controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
// register
authRouter.post('/register',register);
authRouter.post('/login',login);
// authRouter.post('/admin/test', (req, res) => {
//   console.log("✅ Admin test route hit");
//   res.send("Admin test route works");
// });



authRouter.post('/logout',userMiddleware,logout);
// authRouter.post('/getprofile',getprofile);
authRouter.post('/admin/register',adminMiddleware ,adminRegister);


module.exports = authRouter;

// login
//logout
//Get profile
