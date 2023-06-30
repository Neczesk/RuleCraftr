import axios from "axios"


const instance = axios.create()
instance.defaults.withCredentials = true

export async function insertRuleset(newRulesetData){
    const url = import.meta.env.VITE_API_URL + "rulesets"
    let ruleset
    try {
        ruleset = (await instance.post(url, newRulesetData)).data
        return ruleset
    } catch (e) {
        console.log(e)
    }
}

export async function deleteRuleset(id) {
    const url = import.meta.env.VITE_API_URL + "rulesets/" + id.toString()
    let response
    try {
        response = (await instance.delete(url)).data
        return response
    } catch (e) {
        console.log(e)
    }
}

export async function fetchRuleset(id){
    const url = import.meta.env.VITE_API_URL + "rulesets/" + id
    let ruleset
    try {
        ruleset = (await instance.get(url)).data
    } catch (e){
        console.log(e)
    }
    ruleset.synced = true
    return ruleset
}

export async function fetchRulesetsForUser(userId){
    const url = import.meta.env.VITE_API_URL + "rulesets?user=" + userId
    let rulesets
    try {
        rulesets = (await instance.get(url, {
            withCredentials: true
        })).data
    } catch (e) {
        console.log(e)
    }
    return rulesets
}

export async function fetchArticlesForRuleset(id){
    const url = import.meta.env.VITE_API_URL + "rulesets/" + id + "/articles"
    let articles
    try {
        articles = (await instance.get(url)).data
    } catch (e) {
        console.log(e)
    }
    articles = articles.map((article) => {
        article.childrenArticles = []
        article.synched = true
        article.posted = true
        return article
    })
    return articles
}

export async function fetchKeywordsForRuleset(id){
    const url = import.meta.env.VITE_API_URL + "rulesets/" + id + "/keywords"
    let keywords
    try {
        keywords = (await instance.get(url)).data
    } catch (e) {
        console.log(e)
        return
    }
    keywords = keywords.map((keyword) => {
        keyword.synced = true
        keyword.posted = true
        return keyword
    })
    return keywords
}

export async function putRulesetMetadata(rulesetData) {
    if (!rulesetData || !rulesetData.length) return

    const url = import.meta.env.VITE_API_URL + "rulesets"
    const putData = rulesetData.map((ruleset) => ({id: ruleset.id, description: ruleset.description, rn_name: ruleset.rn_name, public: ruleset.public}))

    let response
    try {
        response = (await instance.put(url, putData))
        return response.data
    } catch (e) {
        console.log(e)
    }
}