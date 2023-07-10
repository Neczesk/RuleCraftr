import axios from 'axios';

const instance = axios.create();
instance.defaults.withCredentials = true;

export async function postKeywords(keywordData) {
  const postData = keywordData.map((keyword) => ({
    id: keyword.id,
    long_definition: keyword.longDefinition,
    short_definition: keyword.shortDefinition,
    keyword: keyword.keyword,
    ruleset: keyword.ruleset,
    tag: keyword.tag,
    dummy: keyword.dummy,
  }));

  const url = import.meta.env.VITE_API_URL + 'keywords';
  let response;
  try {
    response = await instance.post(url, postData);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function updateKeywords(keywordData) {
  if (!keywordData || !keywordData.length) return [];

  const putData = keywordData.map((keyword) => ({
    id: keyword.id,
    long_definition: keyword.longDefinition,
    short_definition: keyword.shortDefinition,
    keyword: keyword.keyword,
    tag: keyword.tag,
    dummy: keyword.dummy,
  }));

  const url = import.meta.env.VITE_API_URL + 'keywords';
  let response;
  try {
    response = await instance.put(url, putData);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function deleteKeywords(keywordData) {
  const url = import.meta.env.VITE_API_URL + 'keywords';
  let response;
  try {
    response = await instance.delete(url, { data: keywordData, withCredentials: true });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
