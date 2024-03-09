import { Router } from "express";
import { auth, adminAuth } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/User.mjs";
import { Company } from "../mongoose/schemas/Company.mjs";
import { Shipment } from "../mongoose/schemas/Shipment.mjs";

const router = Router();

// Create a new company
router.post('/api/companies', adminAuth, async (req, res) => {
    try {
        // Extract name and employees from the request body
        const { name, employees } = req.body;
        // Create a new Company instance
        const company = new Company({ name, employees });
        await company.save(); // Save the new company to the database
        res.status(201).json(company); // Respond with the created company
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all companies
router.get('/api/companies', adminAuth, async (req, res) => {
    try {
        const companies = await Company.find().populate('employees', 'email'); // Fetch all companies and populate employee emails
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch companies with employees
router.get('/api/companies/with-employees', auth, async (req, res) => {
    try {
        // Find companies with non-empty employees array
        const companiesWithEmployees = await Company.find({ 'employees.0': { $exists: true } }).populate('employees', 'email');
        if (companiesWithEmployees.length === 0) {
            return res.status(404).json({ message: 'No companies with employees found' });
        }
        res.json(companiesWithEmployees); // Respond with the found companies
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add user to company
router.patch('/api/companies/:companyId/employees', adminAuth, async (req, res) => {
    try {
        const { userId } = req.body; // Get the userId to be added
        const { companyId } = req.params; // Get the companyId from the URL

        const company = await Company.findById(companyId); // Find the user by ID
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the user is already an employee of the company
        const isEmployeeAlreadyAdded = company.employees.some(employee => employee.equals(userId));
        if (isEmployeeAlreadyAdded) {
            return res.status(400).json({ message: 'Employee already added to the company' });
        }

        company.employees.push(user); // Add the user to the company's employees
        await company.save(); // Save the updated company

        res.json({ message: 'Employee added successfully', company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user from company
router.delete('/api/companies/:companyId/employees/:userId', adminAuth, async (req, res) => {
    try {
        const { companyId, userId } = req.params; // Get companyId and userId from the URL

        const company = await Company.findById(companyId); // Find the company by ID
        if (!company) return res.status(404).json({ message: 'Company not found' });

        company.employees.pull(userId); // Remove the user from the company's employees
        await company.save(); // Save the updated company

        res.json({ message: 'Employee removed successfully', company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a company
router.delete('/api/companies/:companyId', adminAuth, async (req, res) => {
    try {
        const { companyId } = req.params;

        // First, delete all shipments associated with this company
        const deletedShipments = await Shipment.deleteMany({ company: companyId });
        console.log(deletedShipments);

        // Then, delete the company itself
        const company = await Company.findByIdAndDelete(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json({ message: 'Company and all associated shipments deleted successfully' });
    } catch (error) {
        console.error('Error deleting company and its shipments:', error);
        res.status(500).json({ message: error.message });
    }
});

// Edit a company's name
router.patch('/api/companies/:companyId/name', adminAuth, async (req, res) => {
    try {
        const { companyId } = req.params;
        const { newName } = req.body;

        // Find the company by ID
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Update the company's name
        company.name = newName;
        await company.save();

        res.json({ message: 'Company name updated successfully', company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;