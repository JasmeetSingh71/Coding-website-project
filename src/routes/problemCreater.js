const express = require('express');
const adminMiddleware=require('../middleware/adminMiddleware')
const userMiddleware=require('../middleware/userMiddleware')
const problemRouter =  express.Router();
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem}=require('../controllers/userProblem')

// Create   first 3 need admin access
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem", userMiddleware,getAllProblem);
// problemRouter.get("/problemSolvedByUser/user",userMiddleware, solvedAllProblemByUser);


module.exports = problemRouter;

// fetch
// update
// delete 