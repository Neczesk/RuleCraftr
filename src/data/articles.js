import Handlebars from 'handlebars';
import articlePage from '../pages/utils/exportTemplates/articlePage';
import blockContentTemplate from '../pages/utils/exportTemplates/blockContentTemplate';
import handlebarHelpers from '../pages/utils/exportTemplates/handlebarHelpers';
import articleContentTemplate from '../pages/utils/exportTemplates/articleContentTemplate';
import { sortKeywords } from './keywords';
import { getCSS } from './exports';
import { fetchAllUsers } from '../network/users';
import keywordContentTemplate from '../pages/utils/exportTemplates/keywordContent.Template';
import paragraphPartial from '../pages/utils/exportTemplates/topLevelBlocks/p';
import h6Partial from '../pages/utils/exportTemplates/topLevelBlocks/h6';
import h5Partial from '../pages/utils/exportTemplates/topLevelBlocks/h5';
import h4Partial from '../pages/utils/exportTemplates/topLevelBlocks/h4';
import h3Partial from '../pages/utils/exportTemplates/topLevelBlocks/h3';
import h2Partial from '../pages/utils/exportTemplates/topLevelBlocks/h2';
import h1Partial from '../pages/utils/exportTemplates/topLevelBlocks/h1';
import table from '../pages/utils/exportTemplates/topLevelBlocks/table';
import thead from '../pages/utils/exportTemplates/topLevelBlocks/tablePartials/thead';
import tbody from '../pages/utils/exportTemplates/topLevelBlocks/tablePartials/tbody';
import trow from '../pages/utils/exportTemplates/topLevelBlocks/tablePartials/trow';
import td from '../pages/utils/exportTemplates/topLevelBlocks/tablePartials/td';
import theadrow from '../pages/utils/exportTemplates/topLevelBlocks/tablePartials/theadrow';
import theader from '../pages/utils/exportTemplates/topLevelBlocks/tablePartials/theader';
import list from '../pages/utils/exportTemplates/topLevelBlocks/list';
import li from '../pages/utils/exportTemplates/topLevelBlocks/listPartials/li';
import _ from 'lodash';

export function buildArticleTree(articles) {
  articles = _.cloneDeep(articles); // Create a deep copy of articles
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

export function changeSort(articleArray, movingId, direction) {
  normalizeArticleSort(articleArray);
  const movingIndex = articleArray.findIndex((child) => child.id === movingId);
  if (direction === 'up') {
    if (movingIndex === 0) return;
    let temp = articleArray[movingIndex].sort;
    articleArray[movingIndex].sort = articleArray[movingIndex - 1].sort;
    articleArray[movingIndex - 1].sort = temp;
    articleArray[movingIndex].synched;
  } else if (direction === 'down') {
    if (movingIndex === articleArray.length - 1) return;
    let temp = articleArray[movingIndex].sort;
    articleArray[movingIndex].sort = articleArray[movingIndex + 1].sort;
    articleArray[movingIndex + 1].sort = temp;
  }
  articleArray.sort((a, b) => a.sort - b.sort);
  return articleArray;
}

export function normalizeArticleSort(articleArray) {
  const articles = articleArray.sort((a, b) => a.sort - b.sort);
  articles.forEach((article, index) => {
    article.sort = index;
  });
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
  article_description: null,
  is_folder: false,
  no_export: false,
  icon_name: null,
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
  Handlebars.registerPartial('keyword-content', keywordContentTemplate);
  Handlebars.registerPartial('paragraph', paragraphPartial);
  Handlebars.registerPartial('h6', h6Partial);
  Handlebars.registerPartial('h5', h5Partial);
  Handlebars.registerPartial('h4', h4Partial);
  Handlebars.registerPartial('h3', h3Partial);
  Handlebars.registerPartial('h2', h2Partial);
  Handlebars.registerPartial('h1', h1Partial);
  Handlebars.registerPartial('table', table);
  Handlebars.registerPartial('thead', thead);
  Handlebars.registerPartial('tbody', tbody);
  Handlebars.registerPartial('trow', trow);
  Handlebars.registerPartial('td', td);
  Handlebars.registerPartial('theadrow', theadrow);
  Handlebars.registerPartial('theader', theader);
  Handlebars.registerPartial('list', list);
  Handlebars.registerPartial('li', li);

  Handlebars.registerHelper('is-not-space', (text) => {
    if (text != ' ') return true;
  });
  Handlebars.registerHelper('eq', function (arg1, arg2) {
    return arg1 === arg2;
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
  const children = articles.filter((article) => article.parent === parentId && !article.no_export);

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
  const newArticle = _.cloneDeep(oldArticle);
  if (updateData) {
    newArticle.content = updateData.content ? updateData.content : newArticle.content;
    newArticle.title = updateData.title !== undefined ? updateData.title : newArticle.title;
    newArticle.synched = false;
    newArticle.article_description =
      updateData.article_description !== undefined ? updateData.article_description : newArticle.article_description;
    newArticle.is_folder = updateData.is_folder !== undefined ? updateData.is_folder : newArticle.is_folder;
    newArticle.no_export = updateData.no_export !== undefined ? updateData.no_export : newArticle.no_export;
    newArticle.icon_name = updateData.icon_name !== undefined ? updateData.icon_name : newArticle.icon_name;
    newArticle.parent = updateData.parent !== undefined ? updateData.parent : newArticle.parent;
    newArticle.sort = updateData.sort !== undefined ? updateData.sort : newArticle.sort;
  }
  return newArticle;
}
