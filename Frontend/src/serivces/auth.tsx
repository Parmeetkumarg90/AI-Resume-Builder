import type { loginFields, sessionData } from '../schema/authSchema';
import axios from 'axios';
import env from '../config/env';
import sessionStore from '../store';

async function loginRequest(data: loginFields) {
    try {
        const result = await axios.post(`${env.VITE_BACKEND_URL}/api/auth/login`, data, {
            withCredentials: true
        });
        return result;
    }
    catch (e: any) {
        return e;
    }
}

// async function contactAdminForAccount(data: loginFields) {
//     try {
//         const result = await axios.post(`${env.VITE_BACKEND_URL}/api/auth/contactAdminForAccount`, data, {
//             withCredentials: true
//         });
//         return result;
//     }
//     catch (e: any) {
//         return e;
//     }
// }

async function getSession(): Promise<sessionData | null> {
    try {
        const result = await axios.get(`${env.VITE_BACKEND_URL}/api/auth/session`, {
            withCredentials: true
        });
        return result?.data;
    }
    catch (e: any) {
        return null;
    }
}

async function logout() {
    try {
        const result = await axios.get(`${env.VITE_BACKEND_URL}/api/auth/logout`, {
            withCredentials: true
        });
        sessionStore.setState((state) => ({ ...state, session: null, allUsers: null }));
        return result?.data;
    }
    catch (e: any) {
        return null;
    }
}

async function GetRequest(url: string) {
    try {
        const result = await axios.get(url, {
            withCredentials: true
        });
        return result?.data;
    }
    catch (e: any) {
        return null;
    }
}

async function PostRequest(url: string, data: any) {
    try {
        const result = await axios.post(url, data, {
            withCredentials: true
        });
        return result?.data;
    }
    catch (e: any) {
        console.log(e)
        return null;
    }
}

async function DeleteRequest(url: string) {
    try {
        const result = await axios.delete(url, {
            withCredentials: true
        });
        return result?.data;
    }
    catch (e: any) {
        return null;
    }
}

async function PatchRequest(url: string, data: any) {
    try {
        const result = await axios.patch(url, data, {
            withCredentials: true
        });
        return result?.data;
    }
    catch (e: any) {
        return null;
    }
}

export { loginRequest, logout, getSession, GetRequest, PostRequest, DeleteRequest, PatchRequest };