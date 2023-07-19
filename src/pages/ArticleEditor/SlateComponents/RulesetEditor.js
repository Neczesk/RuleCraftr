import { Editor, Transforms, Element, Node, Path } from 'slate';

function newCell(number = 0) {
  return {
    type: 'tableCell',
    children: [{ text: 'New Cell ' + number.toString() }],
  };
}

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
          type: 'tableHead',
          children: [
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableHeader',
                  children: [{ text: 'Column1' }],
                },
                {
                  type: 'tableHeader',
                  children: [{ text: 'Column1' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableBody',
          children: [
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [{ text: 'Cell1' }],
                },
                {
                  type: 'tableCell',
                  children: [{ text: 'Cell2' }],
                },
              ],
            },
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [{ text: 'Cell1' }],
                },
                {
                  type: 'tableCell',
                  children: [{ text: 'Cell2' }],
                },
              ],
            },
          ],
        },
      ],
    };
    // Try to insert the table.
    Transforms.insertNodes(editor, newTable, { at: editor.selection, select: true });

    // If the table was inserted successfully and the selection is defined, find the path to the next position.
    const nextPath = Path.next(editor.selection.focus.path);
    console.log(nextPath);
    // Insert the new paragraph at the new path.
    Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] }, { at: nextPath });
  },

  removeTable(editor) {
    const [table, tablePath] = Editor.above(editor, { match: (n) => n.type === 'table' });
    if (!table) return;

    Transforms.removeNodes(editor, { at: tablePath });
  },

  isInTable(editor) {
    if (!editor) return false;
    const [table] = Editor.above(editor, { match: (n) => n.type === 'table' });
    return !!table;
  },

  addColumn(editor) {
    // Check if we're in a table.
    const tableMatch = Editor.above(editor, { match: (n) => n.type === 'table' });

    if (!tableMatch) {
      return; // If not in a table, do nothing
    }

    const [table, tablePath] = tableMatch;

    const newHeader = {
      type: 'tableHeader',
      children: [{ text: 'New Column' }],
    };

    Editor.withoutNormalizing(editor, () => {
      //Find the tableHead element to insert the new header
      const tableHead = table.children.find((child) => child.type === 'tableHead');
      if (tableHead && tableHead.children.length) {
        const tableHeaderRow = tableHead.children[0];
        const newHeaderPath = [...tablePath, table.children.indexOf(tableHead), 0, tableHeaderRow.children.length];
        Transforms.insertNodes(editor, newHeader, { at: newHeaderPath });
      }

      // Find the tableBody element in the table
      const tableBody = table.children.find((child) => child.type === 'tableBody');

      if (!tableBody) {
        return; // If there's no tableBody, do nothing
      }

      tableBody.children.forEach((child) => {
        if (child.type != 'tableRow') return;
        const tableRefresh = Node.get(editor, tablePath); // get the updated table
        const tableBodyRefresh = tableRefresh.children.find((child) => child.type === 'tableBody'); // get the updated tableBody
        const newCellPath = [
          ...tablePath,
          tableRefresh.children.indexOf(tableBodyRefresh),
          tableBodyRefresh.children.indexOf(child),
          child.children.length,
        ];
        Transforms.insertNodes(editor, newCell(0), { at: newCellPath });
      });
    });
  },

  removeColumn(editor) {
    // Check if we're in a table.
    const tableMatch = Editor.above(editor, { match: (n) => n.type === 'table' });

    if (!tableMatch) {
      return; // If not in a table, do nothing
    }

    const [table, tablePath] = tableMatch;
    // Get the index of the current cell
    // Loop through all rows (in head and body)
    // Delete cell at that index

    const rowMatch = Editor.above(editor, { match: (n) => n.type === 'tableRow' });
    if (!rowMatch) {
      return;
    }

    const [row] = rowMatch;

    const cellMatch = Editor.above(editor, { match: (n) => n.type === 'tableHeader' || n.type === 'tableCell' });
    if (!cellMatch) {
      return;
    }

    const [cell] = cellMatch;
    const cellIndex = row.children.indexOf(cell);

    const tableHead = table.children.find((child) => child.type === 'tableHead');
    const tableBody = table.children.find((child) => child.type === 'tableBody');

    tableHead.children.map((row, index) => {
      const removedCellPath = [...tablePath, table.children.indexOf(tableHead), index, cellIndex];
      Transforms.removeNodes(editor, { at: removedCellPath });
    });
    tableBody.children.map((row, index) => {
      const removedCellPath = [...tablePath, table.children.indexOf(tableBody), index, cellIndex];
      Transforms.removeNodes(editor, { at: removedCellPath });
    });
  },

  addRow(editor) {
    // Check if we're in a table.
    const tableMatch = Editor.above(editor, { match: (n) => n.type === 'table' });

    if (!tableMatch) {
      return; // If not in a table, do nothing
    }

    const [table, tablePath] = tableMatch;

    const tableHead = table.children.find((child) => child.type === 'tableHead');
    const tableHeadRow = tableHead.children[0];
    if (!tableHeadRow || !tableHeadRow.children.length) return;

    const tableWidth = tableHeadRow.children.length;

    let newCells = [];
    for (let i = 0; i < tableWidth; i++) {
      const genCell = newCell(i + 1);
      newCells.push(genCell);
    }
    // Create a new row
    const newRow = {
      type: 'tableRow',
      children: newCells,
    };

    // Find the tableBody element in the table
    const tableBody = table.children.find((child) => child.type === 'tableBody');

    if (!tableBody) {
      return; // If there's no tableBody, do nothing
    }

    // Define the path to the new row
    const newRowPath = [...tablePath, table.children.indexOf(tableBody), tableBody.children.length];

    // Insert the new row
    Transforms.insertNodes(editor, newRow, { at: newRowPath });

    // Set the selection to the beginning of the new row
    Transforms.select(editor, [...newRowPath, 0, 0]);
  },

  removeRow(editor) {
    // Check if we're in a table row.
    const rowMatch = Editor.above(editor, { match: (n) => n.type === 'tableRow' });

    if (!rowMatch) {
      return; // If not in a table row, do nothing
    }

    const [, rowPath] = rowMatch;

    // Remove the row
    Transforms.removeNodes(editor, { at: rowPath });
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
