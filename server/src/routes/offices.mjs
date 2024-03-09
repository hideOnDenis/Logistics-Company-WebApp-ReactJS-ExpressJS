import { Router } from "express";
import { auth, adminAuth } from "../utils/middlewares.mjs";
import { Office } from "../mongoose/schemas/Office.mjs";
import { Company } from "../mongoose/schemas/Company.mjs";
import mongoose from "mongoose";

const router = Router();

// Fetch all offices with populated company names
router.get("/api/offices", auth, async (req, res) => {
    try {
        const offices = await Office.find()
            .populate({
                path: 'company',
                select: 'name employees',
                populate: {
                    path: 'employees',
                    model: 'User',
                    select: 'name email'
                }
            })
            // .populate('employees') 
            .populate({
                path: 'employees', // Direct employee references within Office
                model: 'User',
                select: 'name email'
            })
            .populate('shipments');

        res.status(200).json(offices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Create a new office with a reference to an existing company
router.post("/api/offices", adminAuth, async (req, res) => {
    const { name, company: companyId } = req.body;

    if (!name || !companyId) {
        return res.status(400).json({ message: "Name and company ID are required." });
    }

    try {
        const companyExists = await Company.findById(companyId);
        if (!companyExists) {
            return res.status(404).json({ message: "Company not found." });
        }

        const newOffice = new Office({ name, company: companyId });
        const savedOffice = await newOffice.save();


        await Company.findByIdAndUpdate(companyId, { $push: { offices: savedOffice._id } }, { new: true });

        res.status(201).json(savedOffice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Patch request to add a user to an office
router.patch("/api/offices/:officeId/add-user", adminAuth, async (req, res) => {
    const { officeId } = req.params;
    const { userId } = req.body; // Assuming the user ID is sent in the request body

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        // Check if the office exists
        const office = await Office.findById(officeId);
        if (!office) {
            return res.status(404).json({ message: "Office not found." });
        }

        // Update the office by adding the user to the employees array
        const updatedOffice = await Office.findByIdAndUpdate(
            officeId,
            { $addToSet: { employees: userId } }, // $addToSet to avoid adding duplicates
            { new: true } // Return the updated document
        ).populate('employees'); // Populate the employees field to return detailed info

        if (!updatedOffice) {
            return res.status(404).json({ message: "Failed to add user to office." });
        }

        res.status(200).json(updatedOffice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Patch request to remove a user from an office
router.patch("/api/offices/:officeId/remove-user", adminAuth, async (req, res) => {
    const { officeId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        // Check if the office exists
        const office = await Office.findById(officeId);
        if (!office) {
            return res.status(404).json({ message: "Office not found." });
        }

        // Update the office by removing the user from the employees array
        const updatedOffice = await Office.findByIdAndUpdate(
            officeId,
            { $pull: { employees: userId } }, // Use $pull to remove the user ID from the array
            { new: true } // Return the updated document
        ).populate('employees', 'name email'); // Repopulate the employees field to return updated info

        if (!updatedOffice) {
            return res.status(404).json({ message: "Failed to remove user from office." });
        }

        res.status(200).json(updatedOffice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add shipment to office
router.patch("/api/offices/:officeId/add-shipment", adminAuth, async (req, res) => {
    const { officeId } = req.params;
    const { shipmentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(officeId) || !mongoose.Types.ObjectId.isValid(shipmentId)) {
        return res.status(400).json({ message: "Invalid office or shipment ID." });
    }

    try {
        // Check if the office exists
        const office = await Office.findById(officeId);
        if (!office) {
            return res.status(404).json({ message: "Office not found." });
        }


        const shipmentExistsInOffice = office.shipments.includes(shipmentId);
        if (shipmentExistsInOffice) {
            return res.status(400).json({ message: "Shipment already added to this office." });
        }

        // Add the shipment to the office
        office.shipments.push(shipmentId);
        await office.save();

        // Populate shipments and employees before sending the response
        const populatedOffice = await Office.findById(office._id)
            .populate('shipments', 'destination weight')
            .populate('employees', 'name email');

        res.status(200).json(populatedOffice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Fetch offices by company ID
router.get("/api/offices/company/:companyId", auth, async (req, res) => {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(400).json({ message: "Invalid company ID." });
    }

    try {
        const offices = await Office.find({ company: companyId })
            .populate({
                path: 'company',
                select: 'name'
            })
            .populate({
                path: 'employees',
                select: 'name email'
            })
            .populate({
                path: 'shipments',
                select: 'destination weight'
            });

        if (!offices.length) {
            return res.status(404).json({ message: "No offices found for this company." });
        }

        res.status(200).json(offices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Delete an office by ID
router.delete("/api/offices/:officeId", adminAuth, async (req, res) => {
    try {
        const { officeId } = req.params;
        const deletedOffice = await Office.findByIdAndDelete(officeId);

        if (!deletedOffice) {
            return res.status(404).json({ message: "Office not found." });
        }


        res.status(200).json({ message: "Office deleted successfully.", office: deletedOffice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
