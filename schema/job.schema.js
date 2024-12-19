const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    logoUrl: {
        type: String,
        
    },
    jobPosition: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
        enum: ["full-time", "part-time", "contract", "internship", "freelance"],  //enum to select one of five
    },
    remoteOffice: {
        type: String,
        enum: ["work from home", "5-day-office", "hybrid"],  //enum to select one of five
    },
    location: {
        type: String,
       
    },
    jobDescription: {
        type: String,
        
    },
    companyDescription: {
        type: String,
        
    },
    skills: {
        type: Array,
        required: true,
        
    },
    information: {
        type: String,
        
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

module.exports = mongoose.model("Job", jobSchema);

// Homework,add missing fields in schema and update the apis accordingly