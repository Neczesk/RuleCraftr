import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import RulesetEditor from '../SlateComponents/RulesetEditor';

function EditorContextMenu(props) {
  const { open, onClose, position, editor } = props;

  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const tableMenuItemReference = useRef(null);
  const [tableActive, setTableActive] = useState(false);
  const [tableRowMenuOpen, setTableRowMenuOpen] = useState(false);
  const tableRowMenuItemReference = useRef(null);
  const [tableColumnMenuOpen, setTableColumnMenuOpen] = useState(false);
  const tableColumnMenuItemReferene = useRef(null);
  useEffect(() => {
    if (editor) {
      try {
        setTableActive(RulesetEditor.isInTable(editor));
      } catch {
        setTableActive(false);
      }
    }
  }, [editor, open]);
  return (
    <>
      <Menu
        anchorEl={tableColumnMenuItemReferene.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={tableColumnMenuOpen}
        onClose={() => setTableColumnMenuOpen(!tableColumnMenuOpen)}
      >
        <MenuList>
          <MenuItem onClick={() => RulesetEditor.addColumn(editor)}>Add Column</MenuItem>
          <MenuItem onClick={() => RulesetEditor.removeColumn(editor)}>Delete Column</MenuItem>
        </MenuList>
      </Menu>
      <Menu
        anchorEl={tableRowMenuItemReference.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={tableRowMenuOpen}
        onClose={() => setTableRowMenuOpen(false)}
      >
        <MenuList dense>
          <MenuItem onClick={() => RulesetEditor.addRow(editor)}>Add Row</MenuItem>
          <MenuItem onClick={() => RulesetEditor.removeRow(editor)}>Delete Row</MenuItem>
        </MenuList>
      </Menu>
      <Menu
        anchorEl={tableMenuItemReference.current}
        open={tableMenuOpen}
        onClose={() => setTableMenuOpen(false)}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuList dense>
          <MenuItem onClick={() => RulesetEditor.insertTable(editor)}>Insert Table</MenuItem>
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
          <MenuItem onClick={() => RulesetEditor.removeTable(editor)} disabled={!tableActive}>
            Delete Table
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu open={open} onClose={onClose} anchorReference="anchorPosition" anchorPosition={position}>
        <MenuList dense>
          <MenuItem>
            <ListItemIcon>
              <ContentCutOutlinedIcon />
            </ListItemIcon>
            Cut
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <ContentCopyOutlinedIcon />
            </ListItemIcon>
            Copy
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <ContentPasteOutlinedIcon />
            </ListItemIcon>
            Paste
          </MenuItem>
          <MenuItem ref={tableMenuItemReference} onClick={() => setTableMenuOpen(!tableMenuOpen)}>
            <ListItemIcon>
              <TableRowsOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Tables</ListItemText>
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
};

export default EditorContextMenu;
