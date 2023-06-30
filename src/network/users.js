import axios from "axios"


const instance = axios.create()
instance.defaults.withCredentials = true

export async function loginUser(data) {
    const url = import.meta.env.VITE_API_URL + "login"
    let response
    try {
        response = await instance.post(url, data)
        return response.data
     } catch (e) {
        if (Object.keys(e.response?.data).includes('Failure')){
            return e.response.data;
        }
        else {
            return {
                Failure: 'Unknown error occured'
            };
        }


     }
}

export async function logoutUser(){
    const url = import.meta.env.VITE_API_URL + "logout"
    let response
    try {
        response = await instance.post(url)
        return response.data
    } catch (e) {
        if (Object.keys(e.response?.data).includes('Failure')){
            return e.response.data;
        }
        else {
            return {
                Failure: 'Unknown error occured'
            };
        }
    }
}

export async function signupUser(accountForm){
    const url = import.meta.env.VITE_API_URL + "signup"
    let response
    try {
        response = await instance.post(url, accountForm)
        return response.data
    } catch (e) {
        if (Object.keys(e.response?.data).includes('Failure')){
            return e.response.data;
        }
        else {
            return {
                Failure: 'Unknown error occured'
            };
        }
    }
}

export async function changepassword(id, formdata){
    const url = import.meta.env.VITE_API_URL + "user/" + id.toString() + "/changepassword"
    let response
    try {
        response = await instance.put(url, formdata)
        return response.data
    } catch (e) {
        if (Object.keys(e.response?.data).includes('Failure')){
            return e.response.data;
        }
        else {
            return {
                Failure: 'Unknown error occured'
            };
        }
    }
}

export async function changeusername(id, formdata){
    const url = import.meta.env.VITE_API_URL + "user/" + id.toString() + "/changeusername"
    let response
    try {
        response = await instance.put(url, formdata)
        return response.data
    } catch (e) {
        if (Object.keys(e.response?.data).includes('Failure')){
            return e.response.data;
        }
        else {
            return {
                Failure: 'Unknown error occured'
            };
        }
    }
}

export async function get_user(user_id){
    const url = import.meta.env.VITE_API_URL + "user/" + user_id.toString()
    let response
    try {
        response = await instance.get(url)
        return response.data
    } catch (e) {
        if (Object.keys(e.response?.data).includes('Failure')){
            return e.response.data;
        }
        else {
            return {
                Failure: 'Unknown error occured'
            };
        }
    }
}

export async function delete_user(user_id, data){
    const url = import.meta.env.VITE_API_URL + "user/" + user_id.toString() + "/deleteaccount"
    let response
    try {
        response = await instance.delete(url, {data: data})
        return response.data
    } catch (e) {
        if (Object.keys(e.response?.data).includes('Failure')){
            return e.response.data;
        }
        else {
            return {
                Failure: 'Unknown error occured'
            };
        }
    }
}