import { deleteArticles, postArticles, updateArticles } from '../network/articles';
import {
  fetchArticlesForRuleset,
  fetchKeywordsForRuleset,
  fetchRuleset,
  fetchRulesetsForUser,
  insertRuleset,
  putRulesetMetadata,
  deleteRuleset as netDeleteRuleset,
} from '../network/rulesets';
import { deleteKeywords, postKeywords, updateKeywords } from '../network/keywords';
import { buildArticleTree, deleteArticle, findArticleInTree, sortArticle, sortArticles, treeToArray } from './articles';
import Handlebars from 'handlebars';
import articleContentTemplate from '../pages/utils/exportTemplates/articleContentTemplate';
import blockContentTemplate from '../pages/utils/exportTemplates/blockContentTemplate';
import handlebarHelpers from '../pages/utils/exportTemplates/handlebarHelpers';
import rulesetPage from '../pages/utils/exportTemplates/rulesetPage';
import { sortKeywords } from './keywords';
import tocEntry from '../pages/utils/exportTemplates/tocEntry';
import { getCSS } from './exports';

export async function createRuleset(newRulesetData) {
  return await insertRuleset(newRulesetData);
}

export async function deleteRuleset(id) {
  return await netDeleteRuleset(id);
}

export async function getRuleset(id) {
  const ruleset = await fetchRuleset(id);
  const flatArticles = await fetchArticlesForRuleset(id);
  ruleset.articles = buildArticleTree(flatArticles);
  const keywords = await fetchKeywordsForRuleset(id);
  ruleset.keywords = keywords ? keywords : [];
  return ruleset;
}

export async function getRulesetsForUser(userId) {
  return await fetchRulesetsForUser(userId);
}

export function findArticleInRuleset(searchID, articles) {
  if (!articles?.length) return null;
  let article;
  for (let root of articles) {
    article = findArticleInTree(searchID, root);
    if (article) break;
  }
  return article;
}

export function findKeywordInRuleset(searchId, ruleset) {
  if (!ruleset?.keywords?.length) return null;
  return ruleset.keywords.find((keyword) => keyword.id == searchId);
}

export function addArticle(parentId, ruleset, newArticle) {
  const newRuleset = Object.assign({}, ruleset);
  const parentArticle = findArticleInRuleset(parentId, newRuleset.articles);
  if (parentArticle) {
    parentArticle.childrenArticles = parentArticle.childrenArticles
      ? [...parentArticle.childrenArticles, newArticle]
      : [newArticle];
  } else {
    newRuleset.articles = [...newRuleset.articles, newArticle];
  }
  newRuleset.synced = false;
  return sortRuleset(newRuleset);
}

export function addKeyword(ruleset, newKeyword) {
  const newRuleset = Object.assign({}, ruleset);
  newRuleset.keywords.push(newKeyword);
  newRuleset.synced = false;

  return newRuleset;
}

export function removeArticle(articleId, ruleset) {
  const newRuleset = Object.assign({}, ruleset);
  const article = findArticleInRuleset(articleId, newRuleset.articles);
  if (!article) return ruleset;
  deleteArticle(article);
  newRuleset.synced = false;
  return sortRuleset(newRuleset);
}

export function updateArticle(articleId, ruleset, newContent, newTitle) {
  const newRuleset = Object.assign({}, ruleset);
  const article = findArticleInRuleset(articleId, ruleset.articles);
  if (article) {
    article.content = newContent ? newContent : article.content;
    article.title = newTitle || newTitle === '' ? newTitle : article.title;
    article.synched = false;
  }
  newRuleset.synced = false;
  return sortRuleset(newRuleset);
}

export function updateKeyword(keywordData, ruleset) {
  const newRuleset = Object.assign({}, ruleset);
  const keyword = findKeywordInRuleset(keywordData.id, newRuleset);
  if (keyword) {
    keyword.keyword = keywordData.keyword;
    keyword.shortDefinition = keywordData.shortDefinition;
    keyword.longDefinition = keywordData.longDefinition;
    keyword.synced = false;
  }
  newRuleset.synced = false;
  return newRuleset;
}

export function removeKeyword(keywordId, ruleset) {
  const newRuleset = Object.assign({}, ruleset);
  const keyword = findKeywordInRuleset(keywordId, newRuleset);
  if (keyword) {
    keyword.deleted = true;
  }
  newRuleset.synced = false;
  return newRuleset;
}

export function sortRuleset(ruleset) {
  const newRuleset = Object.assign({}, ruleset);
  newRuleset.articles = newRuleset.articles.sort((a, b) => a.sort - b.sort);
  newRuleset.articles.map((article) => sortArticle(article));
  return newRuleset;
}

export async function saveRuleset(ruleset) {
  const newRuleset = Object.assign({}, ruleset);
  // Separate the articles into the ones that were created locally and not saved, the ones
  // that have been changed locally but not saved, and the ones that haven't been changed
  // from the version on the database, and the ones that have been deleted. Then save them as appropriate.
  const articles = newRuleset.articles.flatMap((article) => treeToArray(article));
  const articlesToPost = articles
    .filter((article) => !article.posted && !article.deleted)
    .map((article) => {
      // eslint-disable-next-line no-unused-vars
      const { synched: _synched, posted: _posted, ...postdata } = article;
      return postdata;
    });
  if (articlesToPost.length) await postArticles(articlesToPost);
  const remainingArticles = articles.filter((article) => article.posted && article.synched && !article.deleted);
  const articlesToUpdate = articles
    .filter((article) => article.posted && !article.synched && !article.deleted)
    .map((article) => {
      // eslint-disable-next-line no-unused-vars
      const { synched: _synched, posted: _posted, childrenArticles: _childrenArticles, ...postdata } = article;
      return postdata;
    });
  if (articlesToUpdate.length) await updateArticles(articlesToUpdate);
  const deletedArticles = articles.filter((article) => article.deleted && article.posted);
  if (deletedArticles.length) await deleteArticles(deletedArticles.map((article) => article.id));
  const updatedArticles = [...remainingArticles, ...articlesToPost, ...articlesToUpdate].map((article) => ({
    ...article,
    synched: true,
    childrenArticles: null,
    posted: true,
  }));
  newRuleset.articles = buildArticleTree(updatedArticles);

  // Similar update process for the keywords.
  const remainingKeywords = ruleset.keywords.filter((keyword) => keyword.posted && keyword.synced && !keyword.deleted);
  const keywordsToPost = ruleset.keywords
    .filter((keyword) => !keyword.posted && !keyword.deleted)
    .map((keyword) => {
      // eslint-disable-next-line no-unused-vars
      const { synced: _synced, posted: _posted, ...postdata } = keyword;
      return postdata;
    });
  if (keywordsToPost.length) await postKeywords(keywordsToPost);

  const keywordsToUpdate = ruleset.keywords
    .filter((keyword) => keyword.posted && !keyword.synced && !keyword.deleted)
    .map((keyword) => {
      // eslint-disable-next-line no-unused-vars
      const { synced: _synced, posted: _posted, ...updateData } = keyword;
      return updateData;
    });
  if (keywordsToUpdate.length) await updateKeywords(keywordsToUpdate);

  const deletedKeywords = ruleset.keywords.filter((keyword) => keyword.deleted && keyword.posted);
  if (deletedKeywords.length) await deleteKeywords(deletedKeywords.map((keyword) => keyword.id));

  const updatedKeywords = [...remainingKeywords, ...keywordsToPost, ...keywordsToUpdate].map((keyword) => ({
    ...keyword,
    synced: true,
    posted: true,
  }));
  newRuleset.keywords = updatedKeywords;
  newRuleset.synced = true;

  return newRuleset;
}

export async function updateRulesetMetadata(rulesetData) {
  await putRulesetMetadata(rulesetData);
}

export async function serializeRuleset(ruleset, showDark, theme = 'cherry') {
  const { articles, keywords } = ruleset;
  const sortedKeywords = sortKeywords(keywords);
  const otherArticles = sortArticles(articles.flatMap((article) => treeToArray(article)));
  Handlebars.registerPartial('article-content', articleContentTemplate);
  Handlebars.registerPartial('block-content', blockContentTemplate);
  Handlebars.registerPartial('toc-entry', tocEntry);
  Handlebars.registerHelper('is-not-space', (text) => {
    if (text != ' ') return true;
  });
  Handlebars.registerHelper('closing-block-tag', handlebarHelpers('closing-block-tag', otherArticles, keywords));
  Handlebars.registerHelper('block-tag', handlebarHelpers('block-tag', otherArticles, keywords));
  Handlebars.registerHelper('inline-node', handlebarHelpers('inline-node', otherArticles, keywords));

  let template = Handlebars.compile(rulesetPage);
  const stylesheets = getCSS(showDark, theme);
  const articleCssBlob = new Blob([stylesheets.articleStyle], { type: 'text/css' });
  const articleCssUrl = URL.createObjectURL(articleCssBlob);
  const rulesetCssBlob = new Blob([stylesheets.rulesetStyle], { type: 'text/css' });
  const rulesetCssUrl = URL.createObjectURL(rulesetCssBlob);
  const blob = new Blob(
    [
      template({
        ruleset: ruleset,
        articles: otherArticles,
        keywords: sortedKeywords,
        articleCssUrl: articleCssUrl,
        rulesetCssUrl: rulesetCssUrl,
      }),
    ],
    {
      type: 'text/html',
    }
  );
  return URL.createObjectURL(blob);
}
