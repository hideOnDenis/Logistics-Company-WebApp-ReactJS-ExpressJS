import { Router } from "express";
import { auth, adminAuth } from "../utils/middlewares.mjs";
import { Office } from "../mongoose/schemas/Office.mjs";
import { Company } from "../mongoose/schemas/Company.mjs";
const router = Router();

router.get("/api/offices", auth, async (req, res) => {
    try {
        const offices = await Office.find().populate('employees').populate('shipments');
        res.status(200).json(offices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/api/offices", adminAuth, async (req, res) => {
    const { name, company: companyId } = req.body; // Expecting 'company' to be the company ID

    if (!name || !companyId) {
        return res.status(400).json({ message: "Name and company ID are required." });
    }

    try {
        // Fetch the company by ID to get its employees and shipments
        const company = await Company.findById(companyId).populate('employees').populate('shipments');
        if (!company) {
            return res.status(404).json({ message: "Company not found." });
        }

        const newOffice = new Office({
            name,
            company: companyId,
            employees: company.employees.map(employee => employee._id), // Extracting employee IDs
            shipments: company.shipments.map(shipment => shipment._id) // Extracting shipment IDs
        });

        const savedOffice = await newOffice.save();
        res.status(201).json(savedOffice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/api/offices/:officeId", adminAuth, async (req, res) => {
    try {
        const { officeId } = req.params; // Extracting the office ID from the request parameters
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