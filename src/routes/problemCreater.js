const express = require('express');

const problemRouter =  express.Router();


// Create   first 3 need admin access
problemRouter.post("/create",problemCreate);
problemRouter.patch("/:id", problemUpdate);
problemRouter.delete("/:id",problemDelete);


problemRouter.get("/:id",problemFetch);
problemRouter.get("/", getAllProblem);
problemRouter.get("/user", solvedProblem);

// fetch
// update
// delete 