import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import ArticleEditor from './ArticleEditor'
import ArticleTree from './ArticleTree'
import useRulesetStore from '../../stores/rulesetStore'
import KeywordInspector from './KeywordInspector'
import { findArticleInRuleset, getRuleset } from '../../data/rulesets'
import { useParams } from 'react-router'

function EditorPage() {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const setRuleset = useRulesetStore((state) => state.setRuleset)
  const clearRuleset = useRulesetStore((state) => state.clearRuleset)
  const [currentArticle, setCurrentArticle] = useState(null)
  const params = useParams()
  const rulesetId = params.id
  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'No article selected' }],
    },
  ]
  useEffect(() => {
    setCurrentArticle(null)
    setSelectedKeyword(null)
    clearRuleset()
    if (rulesetId) {
      getRuleset(rulesetId).then((value) => setRuleset(value))
    }
  }, [rulesetId, setRuleset, clearRuleset])
  useEffect(() => {
    const article = findArticleInRuleset(currentArticle, ruleset.articles)
    if (!article) {
      setCurrentArticle(null)
    }
  }, [ruleset, currentArticle])
  const selectArticle = (id) => {
    setCurrentArticle(id)
  }
  const [selectedKeyword, setSelectedKeyword] = useState(null)
  const selectKeyword = (id) => {
    setSelectedKeyword(id)
  }

  const colWidth = { xs: 12, sm: 6, md: 4, lg: 3 }
  return (
    <Grid
      container
      sx={(theme) => ({
        height: 'calc(100vh - 48px)',
        '--Grid-borderWidth': '1px',
        borderTop: 'var(--Grid-borderWidth) solid',
        borderColor: 'divider',
        '& > div': {
          borderRight: 'var(--Grid-borderWidth) solid',
          borderBottom: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          ...Object.keys(colWidth).reduce(
            (result, key) => ({
              ...result,
              [`&:nth-of-type(${12 / colWidth[key]}n)`]: {
                [theme.breakpoints.only(key)]: {
                  borderRight: 'none',
                },
              },
            }),
            {}
          ),
        },
      })}
    >
      <Grid item xs={2} sx={{ padding: 1 }}>
        <ArticleTree
          onArticleSelect={selectArticle}
          selectedNode={currentArticle ? [currentArticle.toString()] : [null]}
        />
      </Grid>
      <Grid
        item
        xs={6}
        lg={7}
        xl={8}
        sx={{
          height: '100%',
        }}
      >
        <ArticleEditor
          initialValue={initialValue}
          articleId={currentArticle}
          selectArticle={selectArticle}
          inspectKeyword={selectKeyword}
        />
      </Grid>
      <Grid item xs={4} lg={3} xl={2} sx={{ height: '100%' }}>
        <KeywordInspector keywordId={selectedKeyword} onSelectKeyword={selectKeyword} />
      </Grid>
    </Grid>
  )
}

EditorPage.propTypes = {
  rulesetId: PropTypes.number,
}

export default EditorPage
