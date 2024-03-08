import axios from 'axios';

const domain = 'http://localhost:3000';

// Register user request
export const register = (body) => {
    return axios.post(`${domain}/api/register`, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// Login user request
export const login = (body) => {
    return axios
        .post(`${domain}/api/login`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log(response.data);
            const { token, email, id, isAdmin } = response.data;
            localStorage.setItem('accessToken', token);
            localStorage.setItem('email', email);
            localStorage.setItem('id', id);
            localStorage.setItem('isAdmin', isAdmin); // Assuming roles is an array or object

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return response.data;
        })
        .catch((error) => {
            console.error('Login failed:', error.response);

            throw error;
        });
};


// Fetch users request
export const getUsers = () => {
    return axios.get(`${domain}/api/users`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};
