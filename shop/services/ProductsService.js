
import axios from 'axios';

const PRODUCTS_API_BASE_URL = "http://192.168.0.23:8080/api/iteminfo";
const LOGIN_API_BASE_URL = "http://192.168.0.23:8080/login";
const REGISTER_API_BASE_URL = "http://192.168.0.23:8080/register";


class ProductsService {

    getProducts() {
        return axios.get(PRODUCTS_API_BASE_URL);

    }
    buyProduct(productId) {
        return axios.post(PRODUCTS_API_BASE_URL + '/' + productId);
    }

    authenticateUser(user) {
        return axios.post(LOGIN_API_BASE_URL, user);
    }
    createUser(user) {
        return axios.post(PRODUCTS_API_BASE_URL + '/register' , user);
    }
}

export default new ProductsService()