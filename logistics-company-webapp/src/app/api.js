import axios from 'axios';

const domain = 'http://localhost:3000';

export const register = (body) => {
    return axios.post(`${domain}/api/register`, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

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
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', id);
            localStorage.setItem('isAdmin', isAdmin); // Assuming roles is an array or object
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        })
        .catch((error) => {
            console.error('Login failed:', error.response);
            // Handle error here
            throw error;
        });
};


// export const getCompanies = () => {
//     return axios.get(`${domain}/api/company`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getUsers = () => {
//     return axios.get(`${domain}/api/users`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getShipments = () => {
//     return axios.get(`${domain}/api/shipments`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const addOffice = (body) => {
//     return axios.post(`${domain}/api/office`, body, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const deleteOffice = (body) => {
//     return axios.delete(`${domain}/api/office/${body.id}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const deleteShipment = (body) => {
//     return axios.delete(`${domain}/api/shipment/${body.id}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const deleteUser = (body) => {
//     return axios.delete(`${domain}/api/user/${body.id}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getOffices = () => {
//     return axios.get(`${domain}/api/office`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const addEmployee = (body) => {
//     return axios.post(`${domain}/api/user`, body, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const addCompany = (body) => {
//     return axios.post(`${domain}/api/company`, body, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getUser = (id) => {
//     return axios.get(`${domain}/api/user/${id}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getUserByUsername = (username) => {
//     return axios.get(`${domain}/api/user/username?username=${username}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const editUser = (body) => {
//     return axios.put(`${domain}/api/user/${localStorage.getItem('id')}`, body, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const createShipment = (body) => {
//     return axios.post(`${domain}/api/shipment`, body, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const registerShipment = (id) => {
//     return axios.patch(`${domain}/api/shipment/register/${id}`, null, {
//         headers: {
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getRegisteredShipments = () => {
//     return axios.get(`${domain}/api/reports/shipment/registered`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getRegisteredShipmentsByUser = (username) => {
//     return axios.get(`${domain}/api/reports/shipment/registeredByUser/${username}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getRegisteredShipmentsNotDelivered = () => {
//     return axios.get(`${domain}/api/reports/shipment/registeredNotDelivered`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getShipmentsSentByUser = (username) => {
//     return axios.get(`${domain}/api/reports/shipment/sentByUser/${username}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };

// export const getShipmentsReceivedByUser = (username) => {
//     return axios.get(`${domain}/api/reports/shipment/receivedByUser/${username}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//     });
// };
