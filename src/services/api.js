import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

api.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            alert('Não foi possível conectar ao servidor!')
            return Promise.reject(new Error('Servidor indisponível!'))
        }

        if (error.response.status === 502 || error.response.status === 503) {
            console.log('Erro no servidor!')
        }

        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error)
    }
)

export default api
