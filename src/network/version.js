import axios from "axios";

const instance = axios.create()

export async function fetchCurrentVersion(){
    const url = import.meta.env.VITE_API_URL + "version"
    let response
    try {
        response = await instance.get(url)
        return response.data
    } catch (e) {
        if (Object.keys(e.response?.data).includes('Failure')){
            return e.response.data
        } else {
            return {
                Failure: 'Unknown error occured while fetching current version'
            }
        }
    }
}
