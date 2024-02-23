import axios from 'axios';

let domain = 'http://localhost:3030/admin';

export const signUp = (body) => {
    return axios.post(`${domain}/auth/signup`, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const signIn = (body) => {
    return axios
        .post(`${domain}/auth/signin`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log(response.data);
            let token = response.data.accessToken;
            localStorage.setItem('accessToken', token);
            localStorage.setItem('userEmail', response.data.email);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('roles', response.data.roles);
            localStorage.setItem('id', response.data.id);
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('acessToken');
            console.log(localStorage.getItem('accessToken'));
        });
};

export const getCompanies = () => {
    return axios.get(`${domain}/company`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getUsers = () => {
    return axios.get(`${domain}/user`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getShipments = () => {
    return axios.get(`${domain}/shipment`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const addOffice = (body) => {
    return axios.post(`${domain}/office`, body, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const deleteOffice = (body) => {
    return axios.delete(`${domain}/office/${body.id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const deleteShipment = (body) => {
    return axios.delete(`${domain}/shipment/${body.id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const deleteUser = (body) => {
    return axios.delete(`${domain}/user/${body.id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getOffices = () => {
    return axios.get(`${domain}/office`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const addEmployee = (body) => {
    return axios.post(`${domain}/user`, body, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const addCompany = (body) => {
    return axios.post(`${domain}/company`, body, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getUser = (id) => {
    return axios.get(`${domain}/user/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getUserByUsername = (username) => {
    return axios.get(`${domain}/user/username?username=${username}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const editUser = (body) => {
    return axios.put(`${domain}/user/${localStorage.getItem('id')}`, body, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const createShipment = (body) => {
    return axios.post(`${domain}/shipment`, body, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const registerShipment = (id) => {
    return axios.patch(`${domain}/shipment/register/${id}`, null, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getRegisteredShipments = () => {
    return axios.get(`${domain}/reports/shipment/registered`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getRegisteredShipmentsByUser = (username) => {
    return axios.get(`${domain}/reports/shipment/registeredByUser/${username}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getRegisteredShipmentsNotDelivered = () => {
    return axios.get(`${domain}/reports/shipment/registeredNotDelivered`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getShipmentsSentByUser = (username) => {
    return axios.get(`${domain}/reports/shipment/sentByUser/${username}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};

export const getShipmentsReceivedByUser = (username) => {
    return axios.get(`${domain}/reports/shipment/receivedByUser/${username}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
};
