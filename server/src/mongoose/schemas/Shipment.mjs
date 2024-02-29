import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

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
        type: String,
        enum: ['preparing', 'shipped', 'delivered', 'cancelled'],
        default: 'preparing',
    },
    destination: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

export const Shipment = mongoose.model("Shipment", ShipmentSchema);
