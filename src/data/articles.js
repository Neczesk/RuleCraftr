import Handlebars from 'handlebars';
import articlePage from '../pages/utils/exportTemplates/articlePage';
import blockContentTemplate from '../pages/utils/exportTemplates/blockContentTemplate';
import handlebarHelpers from '../pages/utils/exportTemplates/handlebarHelpers';
import articleContentTemplate from '../pages/utils/exportTemplates/articleContentTemplate';
import { sortKeywords } from './keywords';
import { getCSS } from './exports';
import { fetchAllUsers } from '../network/users';

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

export async function getAllUsers() {
  return await fetchAllUsers();
}

export function sortArticle(article) {
  if (!article?.childrenArticles?.length) return;

  article.childrenArticles = article.childrenArticles.sort((a, b) => a.sort - b.sort);
  article.childrenArticles.map((article) => sortArticle(article));
}

export function findArticleInTree(searchId, rootArticle) {
  if (!rootArticle) return null;
  let article;
  if (rootArticle.id == searchId) {
    return rootArticle;
  } else {
    if (!rootArticle.childrenArticles?.length) return null;
    article = rootArticle.childrenArticles.find((child) => child.id == searchId);
    if (article) return article;
    for (let child of rootArticle.childrenArticles) {
      article = findArticleInTree(searchId, child);
      if (article) break;
    }
    return article;
  }
}

const emptyArticle = {
  title: 'NO TITLE',
  content: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Start typing here...',
        },
      ],
    },
  ],
  ruleset: null,
  parent: null,
  childrenArticles: [],
  id: null,
  synched: false,
  posted: false,
  sorted: 9999,
};

export function createArticle(rulesetId, parentId, sort = 9999) {
  const newArticle = Object.assign({}, emptyArticle);
  newArticle.id = crypto.randomUUID();
  (newArticle.ruleset = rulesetId), (newArticle.parent = parentId);
  newArticle.sort = sort;
  return newArticle;
}

export function treeToArray(article) {
  let articles;
  if (article.childrenArticles.length) {
    articles = [...article.childrenArticles.flatMap((child) => treeToArray(child)), article];
  } else {
    articles = [article];
  }
  return articles;
}

export function deleteArticle(article) {
  if (!article) return;

  article.deleted = true;
  if (article.childrenArticles?.length) {
    article.childrenArticles.forEach((article) => deleteArticle(article));
  }
}

export async function articleContentToJsonUrl(article) {
  const { content } = article;
  if (content) {
    const blob = new Blob([JSON.stringify(content, null, '\t')], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }
}

export async function serializeArticle(article, ruleset, showDark = false, theme = 'cherry') {
  const { articles, keywords } = ruleset;
  const sortedKeywords = sortKeywords(keywords);
  const otherArticles = articles.flatMap((article) => treeToArray(article));
  Handlebars.registerPartial('article-content', articleContentTemplate);
  Handlebars.registerPartial('block-content', blockContentTemplate);
  Handlebars.registerHelper('is-not-space', (text) => {
    if (text != ' ') return true;
  });
  Handlebars.registerHelper('closing-block-tag', handlebarHelpers('closing-block-tag', otherArticles, keywords));
  Handlebars.registerHelper('block-tag', handlebarHelpers('block-tag', otherArticles, keywords));
  Handlebars.registerHelper('inline-node', handlebarHelpers('inline-node', otherArticles, keywords));
  let template = Handlebars.compile(articlePage);
  const stylesheets = getCSS(showDark, theme);
  const rootStyleCssBlob = new Blob([stylesheets.rootStyle], { type: 'text/css' });
  const rootCssUrl = URL.createObjectURL(rootStyleCssBlob);
  const cssBlob = new Blob([stylesheets.articleStyle], { type: 'text/css' });
  const cssURL = URL.createObjectURL(cssBlob);
  const blob = new Blob(
    [template({ article: article, keywords: sortedKeywords, rootStyleUrl: rootCssUrl, styleURL: cssURL })],
    {
      type: 'text/html',
    }
  );
  return URL.createObjectURL(blob);
}

export function sortArticles(articles, parentId = null) {
  // filter children for specific parent
  const children = articles.filter((article) => article.parent === parentId);

  // sort children
  children.sort((a, b) => a.sort - b.sort);

  let result = [];

  // for each child go deeper and find its children
  for (let child of children) {
    result.push(child);
    const grandChildren = sortArticles(articles, child.id);
    result = result.concat(grandChildren);
  }

  return result;
}

export function updateArticle(oldArticle, updateData) {
  const newArticle = Object.assign({}, oldArticle);
  if (updateData) {
    newArticle.content = updateData.content ? updateData.content : newArticle.content;
    newArticle.title = updateData.title ? updateData.title : newArticle.title;
    newArticle.synched = false;
  }
  return newArticle;
}
