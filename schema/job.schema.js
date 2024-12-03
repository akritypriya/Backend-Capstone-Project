const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    logoUrl: {
        type: String,
        required: true,
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
        required: true,
        enum: ["work from home", "5-day-office", "hybrid"],  //enum to select one of five
    },
    location: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    companyDescription: {
        type: String,
        required: true,
    },
    skills: {
        type: String,
        required: true,
    },
    information: {
        type: String,
        required: true,
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

module.exports = mongoose.model("Job", jobSchema);

// Homework,add missing fields in schema and update the apis accordingly