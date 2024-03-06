import mongoose from "mongoose";

const OfficeSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    shipments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    }]
});

export const Office = mongoose.model("Office", OfficeSchema);
