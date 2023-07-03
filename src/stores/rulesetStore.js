import {create} from "zustand"

const emptyRuleset = {
    rn_name: null,
    public: false,
    user_id: null,
    created_date: null,
    id: null,
    articles: null,
    keywords: null
}

const useRulesetStore = create((set) => ({
    ruleset: emptyRuleset, 
    clearRuleset: () => {set((state) => ({
        ...state,
        ruleset: emptyRuleset
    }))},
    setRuleset: (rulesetData) => {set((state) => {
        return ({
        ...state,
        ruleset:rulesetData
    })})},
    setArticles: (articles) => set((state) => ({
        ...state,
        ruleset: {
            ...state.ruleset,
            articles: articles
        }
    }))
    
}))
export default useRulesetStore

