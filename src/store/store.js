import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import { API_URL, RefreshUrl } from "../http";
import ReklamaService from "../services/ReklamaService";

export default class Store {
    user = {};
    isAuth = false;
    isLoading = false;
    message = '';



    constructor() { 
    makeAutoObservable(this)}
    setAuth(bool) { this.isAuth = bool}
    setUser(user) {this.user = user}
    setLoading(bool) {this.isLoading = bool}
    setMessage(message) { this.message = message}


    async login(email, password, navigate) {
        try {

            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response?.data?.accessToken);
            this.setAuth(true);
            this.setUser(response?.data?.user);
            this.setMessage('');
            navigate('/');
        } catch (error) {
            this.setMessage(error?.response?.data?.message)
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password);
            localStorage.setItem('token', response?.data?.accessToken);
            this.setAuth(true);
            this.setUser(response?.data?.user);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) { console.error(error); }
        }
    }

    async logout(navigate) {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser();
            navigate('/');
            return;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) { console.error(error); }
            console.log(error?.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios?.get(`${API_URL}${RefreshUrl}`, { withCredentials: true })
            // console.log(response);
            localStorage.setItem('token', response?.data?.accessToken);
            this.setAuth(true);
            this.setUser(response?.data?.user);
        } catch (error) {
            console.error('checkAuth error',error?.response?.status);
            // if (error instanceof Error) { console?.error(error); }
            if (error instanceof Error) { 
                // localStorage.removeItem('token')
             }
        } finally {
            this.setLoading(false);
        }
    }
}
