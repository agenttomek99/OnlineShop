import axios from 'axios'
export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const token = 'token';
import AsyncStorage from '@react-native-community/async-storage';
import {decode as atob, encode as btoa} from 'base-64'

class AuthenticationService {

    async executeBasicAuthenticationService(username, password) {
        this.addItemValue(token,this.createBasicAuthToken(username, password))
        return axios.get('http://192.168.0.23:8080/api/basicauth',
            { headers: { authorization: this.createBasicAuthToken(username, password) } })  
    }

    createBasicAuthToken(username, password) {
        return 'Basic ' + btoa(username + ":" + password)
    }
    async registerSuccessfulLogin(username, password) {
        //let basicAuthHeader = 'Basic ' +  window.btoa(username + ":" + password)
        //console.log('registerSuccessfulLogin')
        this.addItemValue(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        this.setupAxiosInterceptors(this.createBasicAuthToken(username, password))
    }

    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }

    async logout() {
        this.removeItemValue(USER_NAME_SESSION_ATTRIBUTE_NAME);
    }

    async isUserLoggedIn() {
        let user = await AsyncStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        console.log(user);
        if (user === null) return false
        return true

    }

    getLoggedInUserName() {
        let user = AsyncStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return ''
        return user
    }
    getLoggedInToken() {
        let user = AsyncStorage.getItem(token)
        if (user === null) return ''
        return user
    }

    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }
    async removeItemValue(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch(exception) {
            return false;
        }
    }
  
    async addItemValue(key,value) {
   try {
       await AsyncStorage.setItem(key,value);
       return true;
   }
   catch(exception) {
       return false;
   }
}

}
export default new AuthenticationService()