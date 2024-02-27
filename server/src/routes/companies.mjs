import { Router } from "express";
import { auth, adminAuth } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/User.mjs";
import { Company } from "../mongoose/schemas/company.mjs";


const router = Router();


// Create a new company
router.post('/api/companies', adminAuth, async (req, res) => {
    try {
        const { name, employees } = req.body;
        const company = new Company({ name, employees });
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all companies
router.get('/api/companies', adminAuth, async (req, res) => {
    try {
        const companies = await Company.find().populate('employees', 'email');
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/api/companies/:companyId/employees', adminAuth, async (req, res) => {
    try {
        const { userId } = req.body;
        const { companyId } = req.params;

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the user is already an employee of the company
        const isEmployeeAlreadyAdded = company.employees.some(employee => employee.equals(userId));
        if (isEmployeeAlreadyAdded) {
            return res.status(400).json({ message: 'Employee already added to the company' });
        }

        company.employees.push(user);
        await company.save();

        res.json({ message: 'Employee added successfully', company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/api/companies/:companyId/employees/:userId', adminAuth, async (req, res) => {
    try {
        const { companyId, userId } = req.params;

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        company.employees.pull(userId);
        await company.save();

        res.json({ message: 'Employee removed successfully', company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;