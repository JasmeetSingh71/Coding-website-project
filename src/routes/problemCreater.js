const express = require('express');
const adminMiddleware=require('../middleware/adminMiddleware')
const problemRouter =  express.Router();
const createProblem=require('../controllers/userProblem')

// Create   first 3 need admin access
problemRouter.post("/create",adminMiddleware,createProblem);
// problemRouter.patch("/:id", updateProblem);
// problemRouter.delete("/:id",deleteProblem);


// problemRouter.get("/:id",getProblemById);
// problemRouter.get("/", getAllProblem);
// problemRouter.get("/user", solvedAllProblemByUser);


module.exports = problemRouter;

// fetch
// update
// delete 