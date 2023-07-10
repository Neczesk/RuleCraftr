export const emptyKeyword = {
  keyword: null,
  ruleset: null,
  longDefinition: [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ],
  shortDefinition: null,
  synced: false,
  posted: false,
  tag: null,
  dummy: false,
};

export function createKeyword(rulesetId, keywordData = null) {
  const newKeyword = Object.assign({}, emptyKeyword);
  newKeyword.ruleset = rulesetId;
  const { keyword, longDefinition, shortDefinition, tag, dummy } = keywordData;
  newKeyword.id = crypto.randomUUID();
  newKeyword.keyword = keyword ? keyword : newKeyword.keyword;
  newKeyword.longDefinition = longDefinition ? longDefinition : newKeyword.longDefinition;
  newKeyword.shortDefinition = shortDefinition ? shortDefinition : newKeyword.shortDefinition;
  newKeyword.tag = tag ? tag : newKeyword.tag;
  newKeyword.dummy = dummy ? dummy : newKeyword.dummy;
  return newKeyword;
}

export function sortKeywords(keywords) {
  if (!keywords || !keywords.length) return;
  return keywords.sort((a, b) => a.keyword.localeCompare(b.keyword));
}
