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
                // Populate company details
                select: 'name', // Select only the company name to be populated here
                populate: {
                    path: 'employees', // Further populate the employees within each company
                    model: 'User', // Ensure this is your actual model name for employees
                    select: 'name email' // Now also fetching the email along with the name
                }
            })
            .populate('employees') // Assuming you might also have direct employee references in Office
            .populate('shipments'); // Continue to populate other references as needed

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
