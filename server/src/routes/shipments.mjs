import { Router } from "express";
import { auth, adminAuth } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/User.mjs";
import { Company } from "../mongoose/schemas/company.mjs";
import { Shipment } from "../mongoose/schemas/Shipment.mjs";


const router = Router();

router.get("/api/shipments", auth, async (req, res) => {
    try {
        // If you want to return shipments for the logged-in user only:
        // const shipments = await Shipment.find({ createdBy: req.user.id }).populate('company', 'name');

        // If you want to return all shipments
        const shipments = await Shipment.find().populate('createdBy', 'email').populate('company', 'name');
        res.json(shipments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new shipment
router.post("/api/shipments", auth, async (req, res) => {
    try {
        const { createdBy, company, status, destination } = req.body;

        // Create new shipment
        const newShipment = new Shipment({
            createdBy,
            company,
            status, // Optional, will default to 'preparing' if not provided
            destination
        });
        await newShipment.save();

        // Update company to include new shipment
        await Company.findByIdAndUpdate(
            company,
            { $push: { shipments: newShipment._id } },
            { new: true, useFindAndModify: false }
        );

        // Update user to include new shipment
        await User.findByIdAndUpdate(
            createdBy,
            { $push: { shipments: newShipment._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(201).json(newShipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});






export default router;