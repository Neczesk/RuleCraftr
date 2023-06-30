export const emptyKeyword = {
    keyword: null,
    ruleset: null,
    longDefinition: null,
    shortDefinition: null,
    synced: false,
    posted: false
}

export function createKeyword(rulesetId, keywordData = null){
    const newKeyword = Object.assign({}, emptyKeyword)
    newKeyword.ruleset = rulesetId
    const {keyword, longDefinition, shortDefinition} = keywordData
    newKeyword.id = crypto.randomUUID()
    newKeyword.keyword = keyword ? keyword : newKeyword.keyword
    newKeyword.longDefinition = longDefinition ? longDefinition : newKeyword.longDefinition
    newKeyword.shortDefinition = shortDefinition ? shortDefinition : newKeyword.shortDefinition
    return newKeyword
}