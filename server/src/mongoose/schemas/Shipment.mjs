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
    weight: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: [0, 'Weight cannot be negative.'],
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: [1, 'Minimum price must be at least $1.'],
    },
});



export const Shipment = mongoose.model("Shipment", ShipmentSchema);
