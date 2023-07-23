import { deleteArticles, postArticles, updateArticles } from '../network/articles';
import {
  fetchArticlesForRuleset,
  fetchKeywordsForRuleset,
  fetchRuleset,
  fetchRulesetsForUser,
  insertRuleset,
  putRulesetMetadata,
  deleteRuleset as netDeleteRuleset,
  fetchPublicRulesets,
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
import keywordContentTemplate from '../pages/utils/exportTemplates/keywordContent.Template';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { editRulesetTags } from './tags';
import _ from 'lodash';
dayjs.extend(utc);
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

export async function createRuleset(newRulesetData) {
  return await insertRuleset(newRulesetData);
}

export function createDemoRuleset() {
  return {
    id: null,
    articles: [],
    keywords: [],
    rn_name: 'DEMO: ALL CHANGES WILL BE LOST',
    user_id: null,
    synced: true,
    demo: true,
  };
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
  return sortRuleset(newRuleset);
}

export function addKeyword(ruleset, newKeyword) {
  const newRuleset = Object.assign({}, ruleset);
  newRuleset.keywords.push(newKeyword);

  return newRuleset;
}

export function removeArticle(articleId, ruleset) {
  const newRuleset = Object.assign({}, ruleset);
  const article = findArticleInRuleset(articleId, newRuleset.articles);
  if (!article) return ruleset;
  deleteArticle(article);
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
  return sortRuleset(newRuleset);
}

export function updateKeyword(keywordData, ruleset) {
  const newRuleset = Object.assign({}, ruleset);
  const keyword = findKeywordInRuleset(keywordData.id, newRuleset);
  if (keyword) {
    keyword.keyword = keywordData.keyword ? keywordData.keyword : keyword.keyword;
    keyword.shortDefinition = keywordData.shortDefinition ? keywordData.shortDefinition : keyword.shortDefinition;
    keyword.longDefinition = keywordData.longDefinition ? keywordData.longDefinition : keyword.longDefinition;
    keyword.tag = keywordData.tag !== undefined ? keywordData.tag : keyword.tag;
    keyword.dummy = keywordData.dummy ? keywordData.dummy : keyword.dummy;
    keyword.synced = false;
  }
  newRuleset.synced = false;
  return newRuleset;
}

export function bulkUpdateKeywords(keywords, ruleset) {
  if (!keywords || !keywords.length) return ruleset;
  const newRuleset = Object.assign({}, ruleset);
  keywords.map((keyword) => {
    const newKeyword = findKeywordInRuleset(keyword.id, newRuleset);
    if (newKeyword) {
      newKeyword.keyword = keyword.keyword;
      newKeyword.shortDefinition = keyword.shortDefinition;
      newKeyword.longDefinition = keyword.longDefinition;
      newKeyword.tag = keyword.tag;
      newKeyword.dummy = keyword.dummy;
      newKeyword.synced = false;
    }
  });
  return newRuleset;
}

export function removeKeyword(keywordId, ruleset) {
  const newRuleset = Object.assign({}, ruleset);
  const keyword = findKeywordInRuleset(keywordId, newRuleset);
  if (keyword) {
    keyword.deleted = true;
  }
  return newRuleset;
}

export function sortRuleset(ruleset) {
  const newRuleset = Object.assign({}, ruleset);
  newRuleset.articles = newRuleset.articles.sort((a, b) => a.sort - b.sort);
  newRuleset.articles.map((article) => sortArticle(article));
  return newRuleset;
}

export async function saveRuleset(ruleset) {
  const newRuleset = _.cloneDeep(ruleset);
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
  updateRulesetMetadata([{ id: newRuleset.id }]);

  return newRuleset;
}

export function getAncestry(startId, articles) {
  let article = findArticleInRuleset(startId, articles);

  const ancestors = [];

  while (article?.parent) {
    article = findArticleInRuleset(article.parent, articles);
    ancestors.push(article);
  }

  return ancestors.filter((ancestor) => ancestor != null);
}

export async function getPublicRulesets(searchString, page, perPage) {
  const tokens = searchString.split(' ');
  const userSearch = tokens.filter((token) => token.startsWith('user:')).map((token) => token.replace('user:', ''));
  const tagSearch = tokens.filter((token) => token.startsWith('tag:')).map((token) => token.replace('tag:', ''));
  const nameSearch = tokens.filter((token) => !token.startsWith('user:') && !token.startsWith('tag:'));
  const userSearchString = userSearch.join();
  const nameSearchString = nameSearch.join();
  const tagSearchString = tagSearch.join();
  return await fetchPublicRulesets(userSearchString, nameSearchString, tagSearchString, page, perPage);
}

export async function updateRulesetMetadata(rulesetData) {
  const datawithdate = await Promise.all(
    rulesetData.map(async (ruleset) => {
      const { tags, ...rest } = ruleset;
      if (tags?.length) await editRulesetTags(ruleset.id, tags);
      return { ...rest, last_modified: dayjs.utc().format() };
    })
  );
  const response = await putRulesetMetadata(datawithdate);
  return response;
}

export async function serializeRuleset(ruleset, showDark, theme = 'cherry') {
  const { articles, keywords } = ruleset;
  const sortedKeywords = sortKeywords(keywords);
  const otherArticles = sortArticles(articles.flatMap((article) => treeToArray(article)));
  const exportedRuleset = _.cloneDeep(ruleset);
  exportedRuleset.articles = buildArticleTree(otherArticles);
  Handlebars.registerPartial('article-content', articleContentTemplate);
  Handlebars.registerPartial('block-content', blockContentTemplate);
  Handlebars.registerPartial('toc-entry', tocEntry);
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

  let template = Handlebars.compile(rulesetPage);
  const stylesheets = getCSS(showDark, theme);
  const rootCssBlob = new Blob([stylesheets.rootStyle], { type: 'text/css' });
  const rootCssUrl = URL.createObjectURL(rootCssBlob);
  const articleCssBlob = new Blob([stylesheets.articleStyle], { type: 'text/css' });
  const articleCssUrl = URL.createObjectURL(articleCssBlob);
  const rulesetCssBlob = new Blob([stylesheets.rulesetStyle], { type: 'text/css' });
  const rulesetCssUrl = URL.createObjectURL(rulesetCssBlob);
  const blob = new Blob(
    [
      template({
        ruleset: exportedRuleset,
        articles: otherArticles,
        keywords: sortedKeywords,
        articleCssUrl: articleCssUrl,
        rulesetCssUrl: rulesetCssUrl,
        rootCssUrl: rootCssUrl,
      }),
    ],
    {
      type: 'text/html',
    }
  );
  return URL.createObjectURL(blob);
}
