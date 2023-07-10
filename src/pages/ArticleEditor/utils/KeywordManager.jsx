import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  TextField,
  Popover,
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import useRulesetStore from '../../../stores/rulesetStore';
import { bulkUpdateKeywords } from '../../../data/rulesets';
import { useSnackbar } from 'notistack';
import TagSelect from '../KeywordInspector/TagSelect';

function KeywordManager(props) {
  const { selectKeyword, createKeyword, deleteKeyword, addTag, updateKeyword } = props;
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setRuleset = useRulesetStore((state) => state.setRuleset);
  const { enqueueSnackbar } = useSnackbar();
  const [keywords, setKeywords] = useState([]);
  const theme = useTheme();
  const [tags, setTags] = useState([]);
  const [rootKeywords, setRootKeywords] = useState([]);

  useEffect(() => {
    if (ruleset && ruleset.keywords) setKeywords(ruleset.keywords);
  }, [ruleset]);
  useEffect(() => {
    if (keywords && keywords.length) {
      setTags([...new Set(keywords.map((keyword) => keyword.tag))]);
      const roots = keywords.filter((keyword) => keyword.tag === null);
      setRootKeywords(roots);
    }
  }, [keywords, ruleset]);

  const [keywordOpen, setKeywordOpen] = useState({});
  const handleKeywordClick = (keywordId) => {
    setKeywordOpen((prev) => ({ ...prev, [keywordId]: !prev[keywordId] }));
  };
  const renderKeyword = (keyword, isRoot) => {
    if (keyword.deleted || keyword.dummy) return null;
    return (
      <ListItem
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setKeywordMenuAnchorPosition({ left: event.clientX, top: event.clientY });
          setKeywordMenuOpen(true);
          setKeywordMenuAnchor(keyword.id);
        }}
        key={keyword.id}
        sx={{ pl: !isRoot ? 2 : 0 }}
        disableGutters
      >
        <ListItemButton onClick={() => handleKeywordClick(keyword.id)}>
          <IconButton onClick={() => selectKeyword(keyword.id)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <ListItemText
            primary={keyword.keyword}
            primaryTypographyProps={{ color: theme.palette.secondary.main }}
            secondary={keywordOpen[keyword.id] ? keyword.shortDefinition : null}
          />
        </ListItemButton>
      </ListItem>
    );
  };
  const [open, setOpen] = useState({});
  const handleTagClick = (tag) => {
    setOpen((prev) => ({ ...prev, [tag]: !prev[tag] }));
  };
  const [renamingTag, setRenamingTag] = useState(null);
  const RenderTag = (tag) => {
    const keywordsInTag = keywords
      ? keywords
          .filter((keyword) => keyword.keyword.includes(searchText))
          .filter((keyword) => keyword.tag == tag && !keyword.deleted)
      : [];
    if (!tag) return null;
    if (!keywordsInTag.length) return null;
    return (
      <div key={tag}>
        <ListItem
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setTagMenuAnchorPosition({ left: event.clientX, top: event.clientY });
            setTagMenuOpen(true);
            setTagMenuAnchor(tag);
          }}
          dense
          disableGutters
          secondaryAction={
            <IconButton
              aria-label="add-keyword-to-tag"
              onClick={() => createKeyword({ keyword: 'New Keyword', shortDefinition: 'New Keyword', tag: tag })}
            >
              <AddCircleOutlineOutlinedIcon />
            </IconButton>
          }
        >
          {renamingTag !== tag ? (
            <ListItemButton onClick={() => handleTagClick(tag)}>
              {open[tag] ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              <ListItemText primary={tag} primaryTypographyProps={{ color: theme.palette.primary.main }} />
            </ListItemButton>
          ) : (
            <TextField
              autoFocus
              type="text"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      renameTag(tagMenuAnchor, renameValue);
                      setTagMenuAnchor(null);
                      renameTag(tag, renameValue);
                      setRenameValue('');
                      setRenamingTag(null);
                    }}
                    disabled={renameValue === ''}
                    sx={{
                      color: renameValue !== '' ? theme.palette.success.main : null,
                    }}
                  >
                    <CheckOutlinedIcon />
                  </IconButton>
                ),
              }}
              size="small"
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              placeholder="New Tag Name"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  renameTag(tagMenuAnchor, renameValue);
                  setTagMenuAnchor(null);
                  renameTag(tag, renameValue);
                  setRenameValue('');
                  setRenamingTag(null);
                }
              }}
            />
          )}
        </ListItem>

        <Collapse in={open[tag]} timeout="auto" unmountOnExit>
          <List dense component="div" disablePadding sx={{ pr: 0 }}>
            {keywordsInTag.length
              ? keywordsInTag
                  .sort((a, b) => a.keyword.localeCompare(b.keyword))
                  .map((keyword) => renderKeyword(keyword, false))
              : null}
          </List>
        </Collapse>
      </div>
    );
  };
  const [tagMenuAnchorPosition, setTagMenuAnchorPosition] = useState({ top: 0, left: 0 });
  const [keywordMenuAnchorPosition, setKeywordMenuAnchorPosition] = useState({ top: 0, left: 0 });
  const [tagMenuOpen, setTagMenuOpen] = useState(false);
  const [keywordMenuOpen, setKeywordMenuOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const renameTag = (oldTagName, newTagName) => {
    const keywordsToUpdate = keywords.filter((keyword) => keyword.tag === oldTagName);
    if (keywordsToUpdate.length) {
      const retaggedKeywords = keywordsToUpdate.map((keyword) => ({ ...keyword, tag: newTagName }));
      const dummy = keywordsToUpdate.find((keyword) => !!keyword.dummy);
      if (dummy) deleteKeyword(dummy.id);
      setRuleset(bulkUpdateKeywords(retaggedKeywords, ruleset));
    }
  };
  const deleteTag = (tag) => {
    const keywordsInTag = keywords.filter((keyword) => keyword.tag == tag && !keyword.deleted);
    if (keywordsInTag.length < 2 && (!keywords.length || keywordsInTag[0].dummy)) {
      deleteKeyword(keywordsInTag[0].id);
      return true;
    } else {
      enqueueSnackbar('A non-empty tag cannot be deleted. Move or delete the keywords in the tag first', {
        variant: 'error',
      });
      return false;
    }
  };
  const [tagMenuAnchor, setTagMenuAnchor] = useState(null);
  const [keywordMenuAnchor, setKeywordMenuAnchor] = useState(null);
  const [tagSelectAnchor, setTagSelectAnchor] = useState(null);
  const [tagSelectPosition, setTagSelectPosition] = useState({ left: 0, top: 0 });
  const [searchText, setSearchText] = useState('');
  return (
    <>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={tagSelectPosition}
        open={!!tagSelectAnchor}
        onClose={() => setTagSelectAnchor(null)}
      >
        <TagSelect
          sx={{ minWidth: '200px' }}
          updateKeyword={updateKeyword}
          keywordId={tagSelectAnchor}
          onClose={() => setTagSelectAnchor(null)}
          addTag={addTag}
          closeOnChange={true}
        />
      </Popover>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={tagMenuAnchorPosition}
        open={tagMenuOpen}
        onClose={() => setTagMenuOpen(false)}
      >
        <MenuItem
          onClick={() => {
            setRenamingTag(tagMenuAnchor);
            setTagMenuOpen(false);
          }}
        >
          Rename Tag
        </MenuItem>
        <MenuItem
          onClick={() => {
            setTagMenuOpen(false);
            deleteTag(tagMenuAnchor);
          }}
        >
          Delete Tag
        </MenuItem>
      </Menu>
      <Menu
        anchorPosition={keywordMenuAnchorPosition}
        anchorReference="anchorPosition"
        open={keywordMenuOpen}
        onClose={() => setKeywordMenuOpen(false)}
      >
        <MenuItem
          onClick={() => {
            setTagSelectPosition(keywordMenuAnchorPosition);
            setTagSelectAnchor(keywordMenuAnchor);
            setKeywordMenuOpen(false);
          }}
        >
          Move Keyword
        </MenuItem>

        <MenuItem
          onClick={() => {
            setKeywordMenuOpen(false);
            deleteKeyword(keywordMenuAnchor);
          }}
        >
          Delete Keyword
        </MenuItem>
      </Menu>
      <TextField
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        variant="filled"
        size="small"
        label="Search Keywords"
        placeholder="Search for a keyword..."
      />
      <List dense disablePadding>
        {tags && tags.length
          ? tags
              .sort((a, b) => {
                if (a === null) return 1;
                else if (b === null) return -1;
                else return a.localeCompare(b);
              })
              .map((tag) => RenderTag(tag))
          : null}
        {rootKeywords.length
          ? rootKeywords
              .sort((a, b) => a.keyword.localeCompare(b.keyword))
              .filter((keyword) => keyword.keyword.includes(searchText))
              .map((keyword) => renderKeyword(keyword, true))
          : null}
        <ListItem disableGutters dense key={'add-root-keyword'}>
          <ListItemButton
            onClick={() => createKeyword({ keyword: 'New Keyword', shortDefinition: 'New Keyword', tag: null })}
          >
            <AddCircleOutlineOutlinedIcon />
            <ListItemText
              primary="Add a new untagged keyword..."
              primaryTypographyProps={{ color: theme.palette.primary.main, fontStyle: 'italic' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}
KeywordManager.propTypes = {
  deleteKeyword: PropTypes.func.isRequired,
  selectKeyword: PropTypes.func.isRequired,
  createKeyword: PropTypes.func.isRequired,
  updateKeyword: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
};
export default KeywordManager;
