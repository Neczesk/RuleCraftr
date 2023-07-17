import { Editor, Transforms, Element } from 'slate';

const RulesetEditor = {
  changeStyle(editor, newStyle) {
    const currentStyle = RulesetEditor.getCurrentElementType(editor);
    if (currentStyle === newStyle) {
      RulesetEditor.setParagraphBlock(editor);
      return;
    }
    if (currentStyle !== 'paragraph') {
      RulesetEditor.setParagraphBlock(editor);
    }
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(newStyle)) {
      RulesetEditor.toggleHeaderBlock(editor, newStyle);
    } else {
      switch (newStyle) {
        case 'code':
          RulesetEditor.toggleCodeBlock(editor);
          break;
        default:
          break;
      }
    }
  },

  getCurrentElementType(editor) {
    let activeElement;
    const { selection } = editor;

    if (selection) {
      const [nodeEntry] = Editor.nodes(editor, {
        at: selection,
        match: (n) => Editor.isBlock(editor, n) && Element.isElement(n),
      });
      if (nodeEntry) {
        const [node] = nodeEntry;
        activeElement = node;
      }
    }
    return activeElement?.type;
  },

  isBoldMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },

  isUnderlineMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.underline === true : false;
  },

  isItalicMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.italic === true : false;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'code',
    });
    return !!match;
  },

  isHeaderBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(n.type),
    });
    return !!match;
  },

  insertTable(editor) {
    const newTable = {
      type: 'table',
      columnNames: ['Column1', 'Column2'],
      children: [
        {
          type: 'row',
          children: [
            {
              type: 'cell',
              children: [{ text: 'content' }],
            },
            {
              type: 'cell',
              children: [{ text: 'content' }],
            },
          ],
        },
        {
          type: 'row',
          children: [
            {
              type: 'cell',
              children: [{ text: 'content' }],
            },
            {
              type: 'cell',
              children: [{ text: 'content' }],
            },
          ],
        },
      ],
    };
    Transforms.insertNodes(editor, newTable, { at: editor.selection, select: true });
  },

  insertArticleRef(editor, id) {
    if (!editor.selection) return;
    const savedSelection = Object.assign({}, editor.selection);
    const articleRef = {
      type: 'articleRef',
      id: id,
      children: [{ text: '' }],
    };
    Transforms.insertNodes(editor, articleRef, { at: editor.selection, select: true });
    const pointAfter = Editor.after(editor, editor.selection.focus);
    return pointAfter ? pointAfter : savedSelection;
  },

  insertKeywordRef(editor, id) {
    if (!editor.selection) return;
    const savedSelection = Object.assign({}, editor.selection);
    const keyword = {
      type: 'keyword',
      id: id,
      children: [{ text: '' }],
    };
    Transforms.insertNodes(editor, keyword, { at: editor.selection, select: true });
    const pointAfter = Editor.after(editor, editor.selection.focus);
    return pointAfter ? pointAfter : savedSelection;
  },

  toggleHeaderBlock(editor, newStyle) {
    const isActive = RulesetEditor.isHeaderBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : newStyle },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },

  toggleBoldMark(editor) {
    const isActive = RulesetEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },

  toggleUnderlineMark(editor) {
    const isActive = RulesetEditor.isUnderlineMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'underline');
    } else {
      Editor.addMark(editor, 'underline', true);
    }
  },

  toggleItalicMark(editor) {
    const isActive = RulesetEditor.isItalicMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'italic');
    } else {
      Editor.addMark(editor, 'italic', true);
    }
  },

  toggleCodeBlock(editor) {
    const isActive = RulesetEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : 'code' },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },

  setParagraphBlock(editor) {
    Transforms.setNodes(
      editor,
      { type: 'paragraph' },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },

  replaceContents(editor, newData) {
    const point = { path: [0, 0], offset: 0 };
    editor.selection = { anchor: point, focus: point };
    // We're directly setting the new children to replace all content
    editor.children = newData;
    // After inserting the node, normalize the editor to ensure it's in a valid state
    Editor.normalize(editor, { force: true });
  },
};

export default RulesetEditor;
