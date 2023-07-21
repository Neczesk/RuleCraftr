import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import FormatIndentIncreaseOutlinedIcon from '@mui/icons-material/FormatIndentIncreaseOutlined';
import FormatIndentDecreaseOutlinedIcon from '@mui/icons-material/FormatIndentDecreaseOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

import RulesetEditor from '../SlateComponents/RulesetEditor';

function EditorContextMenu(props) {
  const { open, onClose, position, editor, openKeywordRefMenu, openArticleRefMenu } = props;

  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const tableMenuItemReference = useRef(null);
  const [listMenuOpen, setListMenuOpen] = useState(false);
  const listMenuItemReference = useRef(null);
  const [referenceMenuOpen, setReferenceMenuOpen] = useState(false);
  const referenceMenuItemReference = useRef(null);
  const [tableActive, setTableActive] = useState(false);
  const [listActive, setListActive] = useState(false);
  const [tableRowMenuOpen, setTableRowMenuOpen] = useState(false);
  const tableRowMenuItemReference = useRef(null);
  const [tableColumnMenuOpen, setTableColumnMenuOpen] = useState(false);
  const tableColumnMenuItemReferene = useRef(null);
  useEffect(() => {
    if (editor) {
      try {
        setTableActive(RulesetEditor.isInTable(editor));
        setListActive(RulesetEditor.isInList(editor));
      } catch {
        setTableActive(false);
        setListActive(false);
      }
    }
  }, [editor, open]);
  return (
    <>
      <Menu
        anchorEl={referenceMenuItemReference.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={referenceMenuOpen}
        onClose={() => {
          onClose();
          setReferenceMenuOpen(false);
        }}
      >
        <MenuList dense>
          <MenuItem
            onClick={(event) => {
              openKeywordRefMenu(event, editor);
              setReferenceMenuOpen(false);
              onClose();
            }}
          >
            <KeyOutlinedIcon fontSize="small" />
            Insert Keyword Reference
          </MenuItem>
          <MenuItem
            onClick={(event) => {
              openArticleRefMenu(event, editor);
              setReferenceMenuOpen(false);
              onClose();
            }}
          >
            <ArticleOutlinedIcon fontSize="small" />
            Insert Article Reference
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu
        anchorEl={tableColumnMenuItemReferene.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={tableColumnMenuOpen}
        onClose={() => {
          setTableColumnMenuOpen(false);
          setTableMenuOpen(false);
          onClose();
        }}
      >
        <MenuList dense>
          <MenuItem
            onClick={() => {
              RulesetEditor.addColumn(editor, 'start');
              setTableColumnMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Add Column at Beginning
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.addColumn(editor, 'end');
              setTableColumnMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Add Column at End
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.addColumn(editor, 'before');
              setTableColumnMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Add Column to Left
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.addColumn(editor, 'after');
              setTableColumnMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Add Column to Right
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.removeColumn(editor);
              setTableColumnMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Delete Column
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu
        anchorEl={tableRowMenuItemReference.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={tableRowMenuOpen}
        onClose={() => {
          setTableRowMenuOpen(false);
          setTableMenuOpen(false);
          onClose();
        }}
      >
        <MenuList dense>
          <MenuItem
            onClick={() => {
              RulesetEditor.addRow(editor, 'start');
              setTableRowMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Insert Row at Top
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.addRow(editor, 'end');
              setTableRowMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Insert Row at Bottom
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.addRow(editor, 'before');
              setTableRowMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Insert Row Before Current
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.addRow(editor, 'after');
              setTableRowMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Insert Row After Current
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.removeRow(editor);
              setTableRowMenuOpen(false);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Delete Current Row
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu
        anchorEl={listMenuItemReference.current}
        open={listMenuOpen}
        onClose={() => {
          onClose();
          setListMenuOpen(false);
        }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuList dense>
          <MenuItem
            onClick={() => {
              RulesetEditor.insertList(editor, 'ordered');
              setListMenuOpen(false);
              onClose();
            }}
          >
            <FormatListNumberedOutlinedIcon fontSize="small" />
            Insert Ordered List
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.insertList(editor, 'unordered');
              setListMenuOpen(false);
              onClose();
            }}
          >
            <FormatListBulletedOutlinedIcon fontSize="small" />
            Insert Unordered List
          </MenuItem>
          <MenuItem
            disabled={!listActive}
            onClick={() => {
              RulesetEditor.increaseListLevel(editor);
              setListMenuOpen(false);
              onClose();
            }}
          >
            <FormatIndentIncreaseOutlinedIcon fontSize="small" />
            Increase List Level (Ctrl + {']'})
          </MenuItem>
          <MenuItem
            disabled={!listActive}
            onClick={() => {
              RulesetEditor.decreaseListLevel(editor);
              setListMenuOpen(false);
              onClose();
            }}
          >
            <FormatIndentDecreaseOutlinedIcon fontSize="small" /> Decrease List Level (Ctrl + {'['})
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu
        anchorEl={tableMenuItemReference.current}
        open={tableMenuOpen}
        onClose={() => {
          setTableMenuOpen(false);
          onClose();
        }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuList dense>
          <MenuItem
            onClick={() => {
              RulesetEditor.insertTable(editor);
              setTableMenuOpen(false);
              onClose();
            }}
          >
            Insert Table
          </MenuItem>
          <MenuItem
            ref={tableRowMenuItemReference}
            disabled={!tableActive}
            onClick={() => setTableRowMenuOpen(!tableRowMenuOpen)}
          >
            Rows
            <ListItemIcon>
              <ArrowRightOutlinedIcon />
            </ListItemIcon>
          </MenuItem>
          <MenuItem
            disabled={!tableActive}
            ref={tableColumnMenuItemReferene}
            onClick={() => setTableColumnMenuOpen(!tableColumnMenuOpen)}
          >
            Columns
            <ListItemIcon>
              <ArrowRightOutlinedIcon />
            </ListItemIcon>
          </MenuItem>
          <MenuItem
            onClick={() => {
              RulesetEditor.removeTable(editor);
              setTableMenuOpen(false);
              onClose();
            }}
            disabled={!tableActive}
          >
            Delete Table
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu open={open} onClose={onClose} anchorReference="anchorPosition" anchorPosition={position}>
        <MenuList dense>
          <MenuItem ref={tableMenuItemReference} onClick={() => setTableMenuOpen(!tableMenuOpen)}>
            <ListItemIcon>
              <TableRowsOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Tables</ListItemText>
            <ListItemIcon>
              <ArrowRightOutlinedIcon />
            </ListItemIcon>
          </MenuItem>
          <MenuItem ref={listMenuItemReference} onClick={() => setListMenuOpen(true)}>
            <ListItemIcon>
              <ListOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Lists</ListItemText>
            <ListItemIcon>
              <ArrowRightOutlinedIcon />
            </ListItemIcon>
          </MenuItem>
          <MenuItem ref={referenceMenuItemReference} onClick={() => setReferenceMenuOpen(true)}>
            <ListItemIcon>
              <AddLinkOutlinedIcon />
            </ListItemIcon>
            <ListItemText>References</ListItemText>
            <ListItemIcon>
              <ArrowRightOutlinedIcon />
            </ListItemIcon>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

EditorContextMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  position: PropTypes.object,
  editor: PropTypes.object,
  openKeywordRefMenu: PropTypes.func.isRequired,
  openArticleRefMenu: PropTypes.func.isRequired,
};

export default EditorContextMenu;
