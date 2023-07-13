import axios from 'axios';

const instance = axios.create();
instance.defaults.withCredentials = true;

export async function fetchAllTags(searchTerm) {
  const url = import.meta.env.VITE_API_URL + 'tags' + '?searchterm=' + searchTerm;
  let response;
  try {
    response = await instance.get(url);
    return response.data;
  } catch (e) {
    if (Object.keys(e.response?.data).includes('Failure')) {
      return e.response.data;
    } else {
      return {
        Failure: 'Unknown error occured while fetching current version',
      };
    }
  }
}

export async function updateRulesetTags(rulesetid, tags) {
  const url = import.meta.env.VITE_API_URL + '/rulesets/' + rulesetid + '/tags';
  let response;
  try {
    response = await instance.put(url, tags);
    return response.data;
  } catch (e) {
    if (Object.keys(e.response?.data).includes('Failure')) {
      return e.response.data;
    } else {
      return {
        Failure: 'Unknown error occured while fetching current version',
      };
    }
  }
}
