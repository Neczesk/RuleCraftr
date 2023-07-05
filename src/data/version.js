import { fetchCurrentVersion } from "../network/version";

export async function getCurrentVersion(){
    return await fetchCurrentVersion()
}