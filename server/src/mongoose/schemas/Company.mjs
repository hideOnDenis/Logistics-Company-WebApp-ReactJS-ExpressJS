import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
        trim: true
    },

    // Other company-specific properties
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

})


export const Company = mongoose.model("Company", CompanySchema);
