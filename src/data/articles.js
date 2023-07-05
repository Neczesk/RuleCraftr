export function buildArticleTree(articles) {
    const lookup = {};
    const roots = [];

    for (let i = 0; i < articles.length; i++) {
        lookup[articles[i].id] = articles[i];
        articles[i].childrenArticles = [];
    }

    for (let i = 0; i < articles.length; i++) {
        if (articles[i].parent !== null) {
            lookup[articles[i].parent].childrenArticles.push(articles[i]);
            lookup[articles[i].parent].childrenArticles.sort((a, b) => a.sort - b.sort);
        } else {
            roots.push(articles[i]);
        }
    }
    return roots;
}

export function sortArticle(article) {
    if (!article?.childrenArticles?.length) return
    
    article.childrenArticles = article.childrenArticles.sort((a, b) => a.sort - b.sort)
    article.childrenArticles.map((article) => sortArticle(article))
}

export function findArticleInTree(searchId, rootArticle) {
    if (!rootArticle ) return null
    let article
    if (rootArticle.id == searchId) {
        return rootArticle
    } else {
        if (!rootArticle.childrenArticles?.length) return null
        article = rootArticle.childrenArticles.find((child) => child.id == searchId)
        if (article) return article
        for (let child of rootArticle.childrenArticles) {
            article = findArticleInTree(searchId, child)
            if (article) break
        }
        return article
    }
}

const emptyArticle = {
    title: 'NO TITLE',
    content: [
        {
            "type": "paragraph",
            "children": [
                {
                    "text": "Start typing here..."
                }
            ]
        }
    ],
    ruleset: null,
    parent: null,
    childrenArticles: [],
    id: null,
    synched: false,
    posted: false,
    sorted: 9999
}

export function createArticle(rulesetId, parentId, sort=9999){
    const newArticle = Object.assign({}, emptyArticle)
    newArticle.id = crypto.randomUUID()
    newArticle.ruleset = rulesetId,
    newArticle.parent = parentId
    newArticle.sort = sort
    return newArticle
}

export function treeToArray(article) {
    let articles;
    if (article.childrenArticles.length) {
        articles = [
            ...article.childrenArticles.flatMap((child) => treeToArray(child)),
            article
        ]
    } else {
        articles = [article]
    }
    return articles;
}

export function deleteArticle(article) {
    if (!article) return

    article.deleted = true
    if (article.childrenArticles?.length){
        article.childrenArticles.forEach((article) => deleteArticle(article))
    }
}

export function serializeArticle(article){
    const j = JSON.stringify(article)
    const blob = new Blob([j], {type: 'text/json'})
    return URL.createObjectURL(blob)
}