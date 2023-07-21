import { useCallback } from 'react';
import { Transforms, Editor, Range } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import {
  HeaderElement,
  CodeElement,
  KeywordLink,
  ArticleLink,
  DefaultElement,
  Leaf,
  ListItemElement,
  ListElement,
  TableElement,
  TableCellElement,
  TableRowElement,
  TableBodyElement,
  TableHeadElement,
  TableHeaderElement,
  TabElement,
} from '../SlateComponents/elementComponents';
import RulesetEditor from './RulesetEditor';
import { ReactEditor } from 'slate-react';

export const GenstaffEditor = (editor) => {
  const { isInline, isVoid, deleteBackward, deleteForward, isSelectable } = editor;

  editor.isSelectable = (element) => {
    if (element.type === 'tab') return false;
    return isSelectable(element);
  };

  editor.isInline = (element) => {
    if (element.type === 'keyword') return true;
    if (element.type === 'articleRef') return true;
    if (element.type === 'tab') return true;
    return isInline(element);
  };

  editor.isVoid = (element) => {
    if (element.type === 'keyword') return true;
    if (element.type === 'articleRef') return true;
    if (element.type === 'tab') return true;
    return isVoid(element);
  };

  editor.deleteForward = (...args) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      //If selection is at the end of its node, and the next node is one of the block nodes that would break, do nothing
      if (Editor.isEnd(editor, selection.focus, selection.focus.path)) {
        const [parentNode] = Editor.parent(editor, selection);
        const nextNodeMatch = Editor.next(editor, { at: parentNode.path });
        if (nextNodeMatch) {
          const [, nextNodePath] = nextNodeMatch;
          const nextBlock = Editor.above(editor, {
            at: nextNodePath,
            match: (n) => !Editor.isEditor(n),
            mode: 'highest',
          });
          if (nextBlock) {
            if (nextBlock[0].type === 'table' || nextBlock[0].type === 'list') return;
          }
        }
      }
    }
    deleteForward(...args);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [parentNode, parentNodePath] = Editor.parent(editor, selection);
      const prevNodeMatch = Editor.previous(editor, { at: parentNode.path });
      if (!prevNodeMatch) {
        return;
      }
      const [, prevNodePath] = prevNodeMatch;
      const prevBlock = Editor.above(editor, { at: prevNodePath, match: (n) => !Editor.isEditor(n), mode: 'highest' });

      if (
        parentNode &&
        parentNode.type === 'paragraph' &&
        Editor.string(editor, ReactEditor.findPath(editor, parentNode)) === '' &&
        prevBlock &&
        prevBlock[0].type === 'table'
      ) {
        return;
      }

      // Check if the selection is at the start of a list item.
      if (parentNode.type === 'listItem' && Editor.isStart(editor, selection.anchor, parentNodePath)) {
        RulesetEditor.decreaseListLevel(editor);
        return;
      }
    }

    deleteBackward(...args);
  };

  return editor;
};

export const useGenstaff = (
  editor,
  selectArticle,
  inspectKeyword,
  openArticleRefMenu,
  openKeywordRefMenu,
  saveArticle,
  enterPressed,
  setEnterPressed
) => {
  /* eslint-disable react/prop-types */
  const renderElement = useCallback(
    (props) => {
      const handleArticleSelect = (id) => {
        Transforms.deselect(editor);
        selectArticle(id);
      };
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(props.element.type)) {
        return <HeaderElement htype={props.element.type} {...props} />;
      } else {
        switch (props.element.type) {
          case 'code':
            return <CodeElement {...props} />;
          case 'keyword':
            return <KeywordLink selectKeyword={inspectKeyword} {...props} />;
          case 'articleRef':
            return <ArticleLink selectArticle={handleArticleSelect} {...props} />;
          case 'table':
            return <TableElement {...props} />;
          case 'tableHead':
            return <TableHeadElement {...props} />;
          case 'tableBody':
            return <TableBodyElement {...props} />;
          case 'tableHeader':
            return <TableHeaderElement {...props} />;
          case 'tableCell':
            return <TableCellElement {...props} />;
          case 'tableRow':
            return <TableRowElement {...props} />;
          case 'tab':
            return <TabElement {...props} />;
          case 'list':
            return <ListElement {...props} />;
          case 'listItem':
            return <ListItemElement {...props} />;
          default:
            return <DefaultElement {...props} />;
        }
      }
    },
    [editor, selectArticle, inspectKeyword]
  );
  /* eslint-enable react/prop-types */
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const onKeyDown = (event) => {
    if (event.key !== 'Enter') {
      setEnterPressed(false);
    }
    if (event.key === '.' && event.ctrlKey) {
      event.preventDefault();
    }
    if ([1, 2, 3, 4, 5, 6].includes(Number(event.key)) && event.ctrlKey) {
      let htype;
      switch (event.key) {
        case '1':
          htype = 'h1';
          break;
        case '2':
          htype = 'h2';
          break;
        case '3':
          htype = 'h3';
          break;
        case '4':
          htype = 'h4';
          break;
        case '5':
          htype = 'h5';
          break;
        case '6':
          htype = 'h6';
          break;
      }
      event.preventDefault();
      RulesetEditor.changeStyle(editor, htype);
    }
    if (event.key === '`' && event.ctrlKey) {
      event.preventDefault();
      RulesetEditor.changeStyle(editor, 'code');
    }
    if (event.key === 'p' && event.ctrlKey) {
      event.preventDefault();
      RulesetEditor.changeStyle(editor, 'paragraph');
    }
    if (event.key === 'u' && event.ctrlKey) {
      event.preventDefault();
      RulesetEditor.toggleUnderlineMark(editor);
    }
    if (event.key === 'b' && event.ctrlKey) {
      event.preventDefault();
      RulesetEditor.toggleBoldMark(editor);
    }
    if (event.key === 'i' && event.ctrlKey) {
      event.preventDefault();
      RulesetEditor.toggleItalicMark(editor);
    }
    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      openArticleRefMenu(event, editor, true);
    }
    if (event.key === 'k' && event.ctrlKey) {
      event.preventDefault();
      openKeywordRefMenu(event, editor, true);
    }
    if (event.key === 'Tab' && RulesetEditor.isInTable(editor)) {
      event.preventDefault();
      RulesetEditor.selectNextCell(editor);
    }
    if (event.key === 'ArrowUp' && RulesetEditor.isInTable(editor)) {
      event.preventDefault();
      RulesetEditor.selectCellUp(editor);
    }
    if (event.key === 'ArrowDown' && RulesetEditor.isInTable(editor)) {
      event.preventDefault();
      RulesetEditor.selectCellDown(editor);
    }
    if (event.key === 'Enter' && !event.ctrlKey && RulesetEditor.isInTable(editor)) {
      event.preventDefault();
      RulesetEditor.addRow(editor);
    }
    if (event.key === 'Enter' && event.ctrlKey && RulesetEditor.isInTable(editor)) {
      event.preventDefault();
      RulesetEditor.addColumn(editor);
    }
    if (event.key === 'Enter' && RulesetEditor.isInList(editor) && !enterPressed) {
      setEnterPressed(true);
    }
    if (event.key === 'Enter' && RulesetEditor.isLastListItem(editor) && enterPressed) {
      event.preventDefault();
      RulesetEditor.decreaseListLevel(editor);
    }
    if (event.key === 'Tab' && !RulesetEditor.isInList(editor) && !RulesetEditor.isInTable(editor)) {
      event.preventDefault();
      RulesetEditor.insertTab(editor);
    }
    if (event.key === 'Tab' && RulesetEditor.isInList(editor)) {
      event.preventDefault();
      RulesetEditor.increaseListLevel(editor);
    }
    if (event.key === ']' && event.ctrlKey && RulesetEditor.isInList(editor)) {
      event.preventDefault();
      RulesetEditor.increaseListLevel(editor);
    }
    if (event.key === '[' && event.ctrlKey && RulesetEditor.isInList(editor)) {
      event.preventDefault();
      RulesetEditor.decreaseListLevel(editor);
    }
    if (event.key === 'Delete' && RulesetEditor.isInTable(editor)) {
      // Check if the selection is at the end of a cell
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === 'tableCell' || n.type === 'tableHeader',
        at: editor.selection,
        mode: 'highest',
      });

      if (match) {
        const [, path] = match;

        // Check if the selection is at the end of the cell
        if (Editor.isEnd(editor, editor.selection.focus, path)) {
          event.preventDefault();
          // Add your custom deletion logic here
        }
      }
    }
    if (event.key === 'Backspace' && RulesetEditor.isInTable(editor)) {
      const [node] = Editor.parent(editor, editor.selection.focus.path);
      // Check if this node is a cell and is empty
      if (
        (node.type === 'tableCell' || node.type === 'tableHeader') &&
        Editor.leaf(editor, editor.selection.focus.path)[0].text.trim() === ''
      ) {
        // Prevent the default backspace behaviour
        event.preventDefault();
      }
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === 'tableCell' || n.type === 'tableHeader',
        at: editor.selection,
        mode: 'highest',
      });

      if (match) {
        const [, path] = match;

        // Check if the selection is at the end of the cell
        if (Editor.isStart(editor, editor.selection.focus, path)) {
          event.preventDefault();
          // Add your custom deletion logic here
        }
      }
    }

    if (isKeyHotkey('mod+z', event)) {
      event.preventDefault();
      editor.undo();
    }
    if (isKeyHotkey('mod+y', event)) {
      event.preventDefault();
      editor.redo();
    }
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const { nativeEvent } = event;
      if (isKeyHotkey('left', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset', reverse: true });
        return;
      }
      if (isKeyHotkey('right', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset' });
        return;
      }
    }

    if (event.key === 's' && event.ctrlKey) {
      event.preventDefault();
      saveArticle();
    }
  };

  return {
    renderElement,
    renderLeaf,
    onKeyDown,
  };
};
