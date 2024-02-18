// src/services/authService.js
const users = []; // This would be your data.js equivalent

export const signInService = async ({ email, password }) => {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        return user;
    } else {
        throw new Error('User not found');
    }
};

export const signUpService = async ({ email, password }) => {
    const exists = users.some(user => user.email === email);
    if (!exists) {
        const newUser = { email, password };
        users.push(newUser);
        return newUser;
    } else {
        throw new Error('User already exists');
    }
};
