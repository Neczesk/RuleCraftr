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

export function updateKeyword(originalKeyword, newData) {
  const newKeyword = Object.assign({}, originalKeyword);
  if (newData) {
    newKeyword.keyword = newData.keyword ? newData.keyword : newKeyword.keyword;
    newKeyword.shortDefinition = newData.shortDefinition ? newData.shortDefinition : newKeyword.shortDefinition;
    newKeyword.longDefinition = newData.longDefinition ? newData.longDefinition : newKeyword.longDefinition;
    newKeyword.tag = newData.tag !== undefined ? newData.tag : newKeyword.tag;
    newKeyword.dummy = newData.dummy ? newData.dummy : newKeyword.dummy;
    newKeyword.synced = false;
  }
  return newKeyword;
}

export function bulkUpdateKeywords(originalKeywords, updateData) {
  const newKeywords = updateData.map((updateKeyword) => {
    const newKeyword = originalKeywords.find((ogKeyword) => ogKeyword.id === updateKeyword.id);
    if (newKeyword) {
      newKeyword.keyword = updateKeyword.keyword;
      newKeyword.shortDefinition = updateKeyword.shortDefinition;
      newKeyword.longDefinition = updateKeyword.longDefinition;
      newKeyword.tag = updateKeyword.tag;
      newKeyword.dummy = updateKeyword.dummy;
      newKeyword.synced = false;
    }
  });
  return newKeywords;
}
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
