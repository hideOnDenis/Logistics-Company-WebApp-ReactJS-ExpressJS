import mongoose from "mongoose";


const ShipmentSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    status: {
        type: mongoose.Schema.Types.String,
        enum: ['preparing', 'shipped', 'delivered', 'cancelled'],
        default: 'preparing',
    },
    destination: {
        type: mongoose.Schema.Types.String,
        required: true
    },

});

export const Shipment = mongoose.model("Shipment", ShipmentSchema);
