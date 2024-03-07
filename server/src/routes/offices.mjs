import { Router } from "express";
import { auth, adminAuth } from "../utils/middlewares.mjs";
import { Office } from "../mongoose/schemas/Office.mjs";
import { Company } from "../mongoose/schemas/Company.mjs";

const router = Router();

// Fetch all offices with populated company names
router.get("/api/offices", auth, async (req, res) => {
    try {
        const offices = await Office.find()
            .populate({
                path: 'company',
                select: 'name employees',
                populate: {
                    path: 'employees', // Assuming 'company' schema has a field 'employees' that references User collection
                    model: 'User', // Specify the model used for population if it's not automatically inferred
                    select: 'name email' // Specify the fields to include
                }
            })
            // .populate('employees') // Assuming direct references, if offices directly reference employees, populate this too
            .populate({
                path: 'employees', // Direct employee references within Office, if applicable
                model: 'User',
                select: 'name email'
            })
            .populate('shipments'); // Assuming you have shipments related to offices and want to populate them too

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

        // This part remains unchanged as it's already correctly updating the company
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

        // Optionally, you might want to check if the user already exists in the office to avoid duplicates

        // Update the office by adding the user to the employees array
        const updatedOffice = await Office.findByIdAndUpdate(
            officeId,
            { $addToSet: { employees: userId } }, // Use $addToSet to avoid adding duplicates
            { new: true } // Return the updated document
        ).populate('employees'); // Populate the employees field to return detailed info, adjust as needed

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

        // Update the office by removing the user from the employees array
        const updatedOffice = await Office.findByIdAndUpdate(
            officeId,
            { $pull: { employees: userId } }, // Use $pull to remove the user ID from the array
            { new: true } // Return the updated document
        ).populate('employees', 'name email'); // Repopulate the employees field to return updated info, adjust as needed

        if (!updatedOffice) {
            return res.status(404).json({ message: "Failed to remove user from office." });
        }

        res.status(200).json(updatedOffice);
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

        // No additional changes needed here for deletion
        res.status(200).json({ message: "Office deleted successfully.", office: deletedOffice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
