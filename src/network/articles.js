import axios from "axios"


const instance = axios.create()
instance.defaults.withCredentials = true

export async function fetchArticle(id){
    const url = import.meta.env.VITE_API_URL + "articles/" + id
    let article
    try {
        article = (await instance.get(url)).data
    } catch (e){
        console.log(e)
    }
    article.childrenArticles = []
    article.synched = true
    article.posted = true
    return article
}

export async function updateArticles(articleData) {
    const url = import.meta.env.VITE_API_URL + "articles"
    let response
    try {
        response = await instance.put(url, articleData)
        return response.data
    } catch (e) {
        console.log(e)
    }
}


export async function postArticles(articleData) {
    const url = import.meta.env.VITE_API_URL + "articles"
    let response
    try {
        response = await instance.post(url, articleData)
        return response.data
    } catch (e) {
        console.log(e)
    }

}

export async function deleteArticles(articleData){
    const url = import.meta.env.VITE_API_URL + "articles"
    let response
    try {
        response = await instance.delete(url, {data: articleData})
        return response.data
    } catch (e) {
        console.log(e)
    }
}