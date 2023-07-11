import { create } from 'zustand';
import { bulkUpdateKeywords, updateKeyword } from '../data/keywords';
import { updateArticle as replaceArticle } from '../data/articles';

const emptyRuleset = {
  rn_name: null,
  public: false,
  user_id: null,
  created_date: null,
  id: null,
  articles: null,
  keywords: null,
};

const useRulesetStore = create((set) => ({
  ruleset: emptyRuleset,
  synced: true,
  clearRuleset: () => {
    set((state) => ({
      ...state,
      ruleset: emptyRuleset,
    }));
  },
  setRuleset: (rulesetData) => {
    set((state) => {
      return {
        ...state,
        ruleset: rulesetData,
      };
    });
  },
  setArticles: (articles) =>
    set((state) => ({
      ...state,
      ruleset: {
        ...state.ruleset,
        articles: articles,
        synced: false,
      },
    })),
  setRulesetChanged: (value = false) => {
    set((state) => ({
      ...state,
      synced: value,
    }));
  },
  setSingleArticle: (articleId, newArticle) =>
    set((state) => {
      function updateArticle(articles) {
        return articles.map((article) => {
          if (article.id === articleId) {
            return replaceArticle(article, newArticle); // If this is the article we want to update, replace it with newArticle.
          } else if (article.childrenArticles) {
            // If this article has child articles, apply the update function to them as well.
            return {
              ...article,
              childrenArticles: updateArticle(article.childrenArticles),
            };
          } else {
            return article; // If this is not the article we want to update, leave it unchanged.
          }
        });
      }

      return {
        ...state,
        synced: false,
        ruleset: {
          ...state.ruleset,
          articles: updateArticle(state.ruleset.articles),
        },
      };
    }),
  setKeywords: (keywords) =>
    set((state) => ({
      ...state,
      synced: false,
      ruleset: {
        ...state.ruleset,
        keywords: keywords,
      },
    })),
  setSingleKeyword: (keywordId, newKeyword) =>
    set((state) => {
      let replaced = false;

      const newKeywords = state.ruleset.keywords.map((keyword) => {
        if (keyword.id === keywordId) {
          replaced = true;
          return updateKeyword(keyword, newKeyword); // If this is the keyword we want to update, replace it with newKeyword.
        } else {
          return keyword; // If this is not the keyword we want to update, leave it unchanged.
        }
      });

      // If the keyword was not replaced, it's a new keyword. Add it to the array.
      if (!replaced) {
        newKeywords.push(newKeyword);
      }

      return {
        ...state,
        synced: false,
        ruleset: {
          ...state.ruleset,
          keywords: newKeywords,
        },
      };
    }),
  removeKeyword: (keywordId) =>
    set((state) => {
      const newKeywords = state.ruleset.keywords.filter((keyword) => keyword.id !== keywordId);
      return {
        ...state,
        synced: false,
        ruleset: {
          ...state.ruleset,
          keywords: newKeywords,
        },
      };
    }),
  updateKeywords: (updatedKeywords) =>
    set((state) => {
      const newKeywords = bulkUpdateKeywords(state.ruleset.keywords, updatedKeywords);

      return {
        ...state,
        synced: false,
        ruleset: {
          ...state.ruleset,
          keywords: newKeywords,
        },
      };
    }),
}));
export default useRulesetStore;
