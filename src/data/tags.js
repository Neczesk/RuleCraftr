import { fetchAllTags, updateRulesetTags } from '../network/tags';

export async function getAllTags(searchTerm) {
  return await fetchAllTags(searchTerm);
}

export async function editRulesetTags(rulesetid, tags) {
  return await updateRulesetTags(rulesetid, tags);
}
