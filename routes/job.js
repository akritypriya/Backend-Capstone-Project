const express = require("express");
const router = express.Router();
const Job = require("../schema/job.schema");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/auth");
dotenv.config();

// /?limit=10&offset=1       offset,page,skip     limit,size,pageSize,count


router.get("/", async (req, res) => {
    const{limit,offset,salary,name}=req.query;
    //conditional query
    const query={};
    if(salary){
        query.salary={$gte:salary,$lte:salary};
    }
    if(name){
        query.companyName={$regex:name|| "",$options:"i"};
    }
    const jobs = await Job.find().skip(offset||0).limit(limit||10);
    //get me jobs with salary btw 2000 and 10000
    // const jobs=await Job.find({salary:{$gte:2000,$lte:10000}}).skip(offset).limit(limit);
    
    //get me jos with salary=salary
   // const jobs = await Job.find({salary}).skip(offset).limit(limit);
    
    // get me jobs which includes company name with name and salary = salary
    // const jobs = await Job.find({ companyName: name, salary }).skip(offset).limit(limit);  // will exactly match the name
    
    // jobs company name should contain name   // Book book BOOK bOOK
    //$regex - for string searching $option-case sensitive
    // const jobs = await Job.find({ companyName: { $regex: name, $options: "i" }, salary }).skip(offset).limit(limit);
    
    //search by company name and job position and  salary and job type
    //  const jobs = await Job.find({ companyName: { $regex: name, $options: "i" }, salary,jobPosition: { $regex: position, $options: "i" },
    //     jobType: { $regex: type, $options: "i" } }).skip(offset).limit(limit);
    
    //search job position and  salary  and job type
        // const jobs = await Job.find({ salary:{$gte :10000 ,$lte:50000},jobPosition: { $regex: position, $options: "i" } }).
        // skip(offset).limit(limit);

    // search by company name or job position or  salary or job type    
    // const jobs = await Job.find({
    //     $or: 
    //         [ name?{companyName: { $regex: name, $options: "i" } }:null,
    //          position?{jobPosition: { $regex: position, $options: "i" } }:null ,
    //          salary?{salary: { $gte: 2000, $lte: 20000 } }:null ,
    //          type? {jobType: { $regex: type, $options: "i" } }:null ].filter(Boolean)
        
    // })
    // .skip(offset)
    // .limit(limit);
    //get me jobs which includes company name with name and salary = salary
    // const jobs = await Job.find({ companyName: {$regex:name|| "",$options:"i"}},
    //      {salary:salary || "" }).skip(offset).limit(limit||10);  //if nothing provide by frontend side e provide default value
  
    
    // const jobs = await Job.find().skip(offset).limit(limit);
    res.status(200).json(jobs);
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
})

router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    const userId = req.user.id;

    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    if (userId !== job.user.toString()) {   // check if the user is the owner of the job
        return res.status(401).json({ message: "You are not authorized to delete this job" });
    }
    await Job.deleteOne({ _id: id });
    res.status(200).json({ message: "Job deleted" });
})

router.post("/", authMiddleware, async (req, res) => {
    const { companyName,logoUrl, jobPosition, salary, jobType,remoteOffice,
        location,jobDescription,companyDescription,skills,information} = req.body;
    if (!companyName || !logoUrl|| !jobPosition|| !salary|| !jobType|| !remoteOffice||
        !location|| !jobDescription|| !companyDescription|| !skills||!information) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const user = req.user;
        const job = await Job.create({
            companyName,
            logoUrl, 
            jobPosition, 
            salary, 
            jobType,
            remoteOffice,
            location,
            jobDescription,
            companyDescription,
            skills,
            information,
            user: user.id,
        });
        res.status(200).json(job);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in creating job" });
    }

})

router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { companyName,logoUrl, jobPosition, salary, jobType,remoteOffice,
        location,jobDescription,companyDescription,skills,information} = req.body;
    const job = await Job.findById(id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    if (job.user.toString() !== req.user.id) {   // check if the user is the owner of the job
        return res.status(401).json({ message: "You are not authorized to update this job" });
    }
    try {
        await Job.findByIdAndUpdate(id, {
            companyName,
            logoUrl, 
            jobPosition, 
            salary, 
            jobType,
            remoteOffice,
            location,
            jobDescription,
            companyDescription,
            skills,
            information,
        });
        res.status(200).json({ message: "Job updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in updating job" });
    }
})

module.exports = router;


// Pagination
// Searching 
// Filtering 

// Homework 
// make as sophisticated and complex filtering and searching as you can
// for ex: make it so that it can search by company name and job position and  salary and job type
// for ex: make it so that it can search by company name or job position or  salary or job type