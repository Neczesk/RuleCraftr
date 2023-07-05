import {changepassword, changeusername, delete_user, get_user, loginUser as netLoginUser, logoutUser as netLogoutUser, signupUser, update_user} from '../network/users'

export async function loginUser(data) {
    return await netLoginUser(data)
}

export async function logoutUser(){
    return await netLogoutUser()
}

export async function createAccount(formData){
    
    return await signupUser(formData)
}

export async function changePassword(formData, user_id){
    return await changepassword(user_id, formData)
}

export async function changeUsername(user_id, formData){
    return await changeusername(user_id, formData)
}

export async function getUser(user_id){
    return await get_user(user_id)
}

export async function deleteUserAccount(user_id, data){
    return await delete_user(user_id, data)
}

export async function updateUser(user_id, data){
    return await update_user(user_id, data)
}