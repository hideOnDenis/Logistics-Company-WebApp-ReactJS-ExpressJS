import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // Other company-specific properties
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    shipments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    }],
    offices: [{ // Add this to reference offices
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Office'
    }]
});

export const Company = mongoose.model("Company", CompanySchema);
