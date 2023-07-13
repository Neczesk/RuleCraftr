import axios from 'axios';

const instance = axios.create();
instance.defaults.withCredentials = true;

export async function insertRuleset(newRulesetData) {
  const url = import.meta.env.VITE_API_URL + 'rulesets';
  let ruleset;
  try {
    ruleset = (await instance.post(url, newRulesetData)).data;
    return ruleset;
  } catch (e) {
    if (Object.keys(e.response.data).includes('Failure')) {
      return e.response.data;
    } else
      return {
        Failure: 'An unknown error occured',
      };
  }
}

export async function deleteRuleset(id) {
  const url = import.meta.env.VITE_API_URL + 'rulesets/' + id.toString();
  let response;
  try {
    response = (await instance.delete(url)).data;
    return response;
  } catch (e) {
    if (Object.keys(e.response?.data).includes('Failure')) {
      return e.response.data;
    } else {
      return {
        Failure: 'Unknown error occured',
      };
    }
  }
}

export async function fetchRuleset(id) {
  const url = import.meta.env.VITE_API_URL + 'rulesets/' + id;
  let ruleset;
  try {
    ruleset = (await instance.get(url)).data;
    ruleset.synced = true;
    return ruleset;
  } catch (e) {
    if (Object.keys(e.response?.data).includes('Failure')) {
      return e.response.data;
    } else {
      return {
        Failure: 'Unknown error occured',
      };
    }
  }
}

export async function fetchRulesetsForUser(userId) {
  const url = import.meta.env.VITE_API_URL + 'rulesets?user=' + userId;
  let rulesets;
  try {
    rulesets = (
      await instance.get(url, {
        withCredentials: true,
      })
    ).data;
  } catch (e) {
    if (Object.keys(e.response?.data).includes('Failure')) {
      return e.response.data;
    } else {
      return {
        Failure: 'Unknown error occured',
      };
    }
  }
  return rulesets;
}

export async function fetchPublicRulesets(userSearchString, nameSearchString, tagSearchString, page, perPage) {
  const url = import.meta.env.VITE_API_URL + 'rulesets/' + 'public';
  let rulesets;
  try {
    rulesets = (
      await instance.get(url, {
        withCredentials: true,
        params: {
          tags: tagSearchString,
          name: nameSearchString,
          user: userSearchString,
          page: page,
          perpage: perPage,
        },
      })
    ).data;
  } catch (e) {
    if (Object.keys(e.response?.data).includes('Failure')) {
      return e.response.data;
    } else {
      return {
        Failure: 'Unknown error occured',
      };
    }
  }
  return rulesets;
}

export async function fetchArticlesForRuleset(id) {
  const url = import.meta.env.VITE_API_URL + 'rulesets/' + id + '/articles';
  let articles;
  try {
    articles = (await instance.get(url)).data;
  } catch (e) {
    if (Object.keys(e.response?.data).includes('Failure')) {
      return e.response.data;
    } else {
      return {
        Failure: 'Unknown error occured',
      };
    }
  }
  articles = articles.map((article) => {
    article.childrenArticles = [];
    article.synched = true;
    article.posted = true;
    return article;
  });
  return articles;
}

export async function fetchKeywordsForRuleset(id) {
  const url = import.meta.env.VITE_API_URL + 'rulesets/' + id + '/keywords';
  let keywords;
  try {
    keywords = (await instance.get(url)).data;
  } catch (e) {
    if (Object.keys(e.response?.data).includes('Failure')) {
      return e.response.data;
    } else {
      return {
        Failure: 'Unknown error occured',
      };
    }
  }
  keywords = keywords.map((keyword) => {
    keyword.synced = true;
    keyword.posted = true;
    return keyword;
  });
  return keywords;
}

export async function putRulesetMetadata(rulesetData) {
  if (!rulesetData || !rulesetData.length) return { Failure: 'Error in attempt to update ruleset' };

  const url = import.meta.env.VITE_API_URL + 'rulesets';
  const putData = rulesetData.map((ruleset) => ({
    id: ruleset.id,
    description: ruleset.description,
    rn_name: ruleset.rn_name,
    public: ruleset.public,
    last_modified: ruleset.last_modified,
  }));

  let response;
  try {
    response = await instance.put(url, putData);
    return response.data;
  } catch (e) {
    if (Object.keys(e.response?.data).includes('Failure')) {
      return e.response.data;
    } else {
      return {
        Failure: 'Unknown error occured',
      };
    }
  }
}
