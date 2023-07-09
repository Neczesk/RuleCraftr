export const emptyKeyword = {
  keyword: null,
  ruleset: null,
  longDefinition: null,
  shortDefinition: null,
  synced: false,
  posted: false,
  tag: null,
};

export function createKeyword(rulesetId, keywordData = null) {
  const newKeyword = Object.assign({}, emptyKeyword);
  newKeyword.ruleset = rulesetId;
  const { keyword, longDefinition, shortDefinition, tag } = keywordData;
  newKeyword.id = crypto.randomUUID();
  newKeyword.keyword = keyword ? keyword : newKeyword.keyword;
  newKeyword.longDefinition = longDefinition ? longDefinition : newKeyword.longDefinition;
  newKeyword.shortDefinition = shortDefinition ? shortDefinition : newKeyword.shortDefinition;
  newKeyword.tag = tag ? tag : newKeyword.tag;
  return newKeyword;
}

export function sortKeywords(keywords) {
  if (!keywords || !keywords.length) return;
  return keywords.sort((a, b) => a.keyword.localeCompare(b.keyword));
}
