import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

jest.mock('../mongoose/schemas/User.mjs');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../utils/middlewares.mjs', () => ({
    auth: jest.fn((req, res, next) => next()),
    adminAuth: jest.fn((req, res, next) => next())
}));

const { User } = require('../mongoose/schemas/User.mjs');
const bcrypt = require('bcryptjs');
const app = express();
app.use(bodyParser.json());
app.use('/', require('./users.mjs')); // Adjust the path to match your project structure

// Set up any global configuration for your tests
beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    User.mockClear();
    bcrypt.compare.mockClear();
    jwt.sign.mockClear();
});


describe('POST /api/register', () => {
    it('should register a new user successfully', async () => {
        User.findOne.mockResolvedValue(null); // Simulate user not existing yet
        User.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(true) })); // Mock user save

        const response = await request(app)
            .post('/api/register')
            .send({ email: 'newuser@example.com', password: 'password123' });

        expect(response.statusCode).toBe(201);
        expect(response.text).toEqual('User created successfully');
    });

    // Add more tests to cover different scenarios, such as user already exists
});

describe('POST /api/login', () => {
    it('should authenticate a user successfully', async () => {
        User.findOne.mockResolvedValue({
            _id: 'user123',
            email: 'user@example.com',
            password: 'hashedpassword',
            isAdmin: false
        });
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('token123');

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'user@example.com', password: 'password123' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            token: 'token123',
            email: 'user@example.com',
            id: 'user123',
            isAdmin: false
        }));
    });

    // Add more tests to cover different scenarios, such as incorrect password, user not found, etc.
});
