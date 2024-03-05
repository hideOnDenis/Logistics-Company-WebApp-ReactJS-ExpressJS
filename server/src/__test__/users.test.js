import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { User } from '../mongoose/schemas/User.mjs'; // Ensure correct path

// Mock external modules
jest.mock('../mongoose/schemas/User.mjs', () => ({
    User: {
        findOne: jest.fn(),
        save: jest.fn().mockImplementation(() => ({ _id: 'mockUserId', email: 'mock@example.com' })),
    },
}));
jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

// Import your router here. Ensure the path is correct
import usersRouter from '../routes/users.mjs';

const app = express();
app.use(bodyParser.json());
app.use('/', usersRouter); // Ensure you're using the correct path to your users router

beforeEach(() => {
    jest.clearAllMocks(); // Clears the mock call history before each test
});

describe('POST /api/register', () => {
    it('should register a new user successfully', async () => {
        require('../mongoose/schemas/User.mjs').User.findOne.mockResolvedValue(null); // Simulate user not existing
        const mockSave = jest.fn().mockResolvedValue(true); // Mock save method
        require('../mongoose/schemas/User.mjs').User.mockImplementation(() => ({ save: mockSave }));

        const response = await request(app)
            .post('/api/register')
            .send({ email: 'newuser@example.com', password: 'password123' });

        expect(response.statusCode).toBe(201);
        expect(mockSave).toHaveBeenCalled(); // Ensure the save method was called
    });
});

describe('POST /api/login', () => {
    it('should authenticate a user successfully', async () => {
        const userCredentials = { email: 'user@example.com', password: 'password123' };
        User.findOne.mockResolvedValueOnce({
            _id: 'user123',
            email: userCredentials.email,
            password: 'hashedpassword', // Assuming this is the hashed version of 'password123'
        });

        // Mock bcrypt compare to return true for matching passwords
        const bcrypt = require('bcryptjs');
        bcrypt.compare.mockResolvedValueOnce(true);

        // Mock jwt to return a token
        const jwt = require('jsonwebtoken');
        jwt.sign.mockReturnValue('token123');

        const response = await request(app).post('/api/login').send(userCredentials);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token', 'token123');
        expect(bcrypt.compare).toHaveBeenCalledWith(userCredentials.password, 'hashedpassword');
        expect(jwt.sign).toHaveBeenCalledTimes(1);
    });


});
