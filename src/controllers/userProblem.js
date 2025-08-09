const {getLanguageById,submitBatch,submitToken}=require('../utils/ProblemUtility')
const Problem=require('../models/problem')



const createProblem=async(req,res)=>{

    const {title,discription,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;
  

    try{
           for(const {language,completeCode} of referenceSolution)
           {

            const languageId=getLanguageById(language);

            const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken=submitResult.map((value)=>value.token);

        const testResult=await submitToken(resultToken);

            for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }
    }


     const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully")
    }
    catch(err){
 res.status(400).send("Error: "+err);
    }

}


const updateProblem=async(req,res)=>{
    const {id}=req.params;
     const {title,discription,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;
  


    try{

        if(!id)
           return  res.status(400).send("Invalid Id");

        const dsaproblem=await Problem.findById(id);

        if(!dsaproblem)
        {
            return  res.status(404).send("problem does not exist");
        }

           for(const {language,completeCode} of referenceSolution)
           {

            const languageId=getLanguageById(language);

            const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken=submitResult.map((value)=>value.token);

        const testResult=await submitToken(resultToken);

            for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }
    }
        await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true, new:true});
        res.status(200).send("newProblem");
  

    }
    catch(err){
        res.status(404).send("Error: "+err);
    }
}

const deleteProblem=async(req,res)=>{
         const{id}=req.params;
         try{
                  if(!id)
                  {
           return  res.status(400).send("Id Missing");
                  }

           const deletedproblem=await Problem.findByIdAndDelete(id);

           if(!deletedproblem)
           {
            res.status(404).send("problem is missing");

           }

           res.status(200).send("successfully deleted");

         }
         catch(err){
             res.status(500).send("Error :"+err);
         }
}

const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode');

   if(!getProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const getAllProblem = async(req,res)=>{

  try{
     
    const getProblem = await Problem.find({}).select('_id title difficulty tags');

   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}


module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem};