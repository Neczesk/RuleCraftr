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

  insertList(editor, type) {
    const newList = {
      type: 'list',
      subtype: type,
      children: [
        {
          type: 'listItem',
          children: [{ text: '' }],
        },
      ],
    };
    Transforms.insertNodes(editor, newList);
  },

  increaseListLevel(editor) {
    const listItemMatch = Editor.above(editor, { match: (n) => n.type === 'listItem' });

    if (!listItemMatch) {
      return; // Not in a list item, do nothing
    }

    const [listItem, listItemPath] = listItemMatch;
    const parentListMatch = Editor.above(editor, { match: (n) => n.type === 'list' });

    if (!parentListMatch) {
      return; // Not in a list, do nothing
    }

    const [parentList] = parentListMatch;
    const itemIndex = parentList.children.indexOf(listItem);
    if (itemIndex === 0) {
      // If this is the first item in the list, do nothing
      return;
    }
    // Create a new list of the same subtype as the parent list and containing the current list item
    const newList = {
      type: 'list',
      subtype: parentList.subtype,
      children: [listItem],
    };

    // Remove the current list item
    Transforms.removeNodes(editor, { at: listItemPath });

    // Insert the new list at the end of the list item
    Transforms.insertNodes(editor, newList, { at: listItemPath, select: true });
  },

  decreaseListLevel(editor) {
    const listItemMatch = Editor.above(editor, { match: (n) => n.type === 'listItem' });

    if (!listItemMatch) {
      return; // Not in a list item, do nothing
    }

    const [, listItemPath] = listItemMatch;
    const parentListMatch = Editor.above(editor, { match: (n) => n.type === 'list' });

    if (!parentListMatch) {
      return; // Not in a list, do nothing
    }

    const [parentList, parentListPath] = parentListMatch;
    const grandParentMatch = Editor.above(editor, { at: parentListPath, match: (n) => n.type === 'list' });

    // If there's no grandparent list, the list item is already at the top level.
    // The list needs to be converted to a paragraph at the top level of the document
    if (!grandParentMatch) {
      Transforms.setNodes(editor, { type: 'paragraph' }, { at: listItemPath });
      const newPath = Path.next(parentListPath);
      Transforms.moveNodes(editor, { at: listItemPath, to: newPath });
      return;
    }

    const [grandParentList, grandParentListPath] = grandParentMatch;

    // The new path for the list item is in the grandparent list, directly after its parent list
    const newListItemPath = [...grandParentListPath, grandParentList.children.indexOf(parentList)];

    // Move the list item to its new path
    Transforms.moveNodes(editor, { at: listItemPath, to: newListItemPath });
  },

  insertTab(editor) {
    const tab = {
      type: 'tab',
      children: [{ text: '' }],
    };
    Transforms.insertNodes(editor, tab);
    Transforms.move(editor);
    Transforms.move(editor, { unit: 'character', reverse: true });
  },

  insertTable(editor) {
    const newTable = {
      type: 'table',
      children: [
        {
          type: 'tableHead',
          children: [
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableHeader',
                  width: 200,
                  children: [{ text: 'Column1' }],
                },
                {
                  type: 'tableHeader',
                  width: 100,
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
    const tableMatch = Editor.above(editor, { match: (n) => n.type === 'table' });
    if (!tableMatch) return;

    const [table, tablePath] = tableMatch;
    const nextPath = Path.next(tablePath);
    Transforms.select(editor, [...tablePath, table.children.findIndex((child) => child.type === 'tableHead'), 0, 0]);
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
    const tableMatch = Editor.above(editor, { match: (n) => n.type === 'table' });
    return !!tableMatch;
  },

  isInList(editor) {
    if (!editor) return false;
    const listMatch = Editor.above(editor, { match: (n) => n.type === 'list' });
    return !!listMatch;
  },

  isLastListItem(editor) {
    const listItemMatch = Editor.above(editor, { match: (n) => n.type === 'listItem' });
    const listMatch = Editor.above(editor, { match: (n) => n.type === 'list' });

    if (listItemMatch && listMatch) {
      const [listItem] = listItemMatch;
      const [list] = listMatch;

      const listItemIndex = list.children.indexOf(listItem);
      if (listItemIndex === list.children.length - 1) {
        return true;
      }
    }
    return false;
  },

  addColumn(editor, position = 'end') {
    // Check if we're in a table.
    const tableMatch = Editor.above(editor, { match: (n) => n.type === 'table' });

    if (!tableMatch) {
      return; // If not in a table, do nothing
    }

    const [table, tablePath] = tableMatch;

    const newHeader = {
      type: 'tableHeader',
      children: [{ text: 'New Column' }],
      width: 100,
    };

    const rowMatch = Editor.above(editor, { match: (n) => n.type === 'tableRow' });
    const [row] = rowMatch;
    const cellMatch = Editor.above(editor, { match: (n) => n.type === 'tableCell' });
    const [, cellPath] = cellMatch;
    const currentIndex = cellPath[cellPath.length - 1];
    let newIndex;
    if (position === 'end') newIndex = row.children.length;
    if (position === 'start') newIndex = 0;
    if (position === 'before') newIndex = currentIndex;
    if (position === 'after') newIndex = currentIndex + 1;

    Editor.withoutNormalizing(editor, () => {
      //Find the tableHead element to insert the new header
      const tableHead = table.children.find((child) => child.type === 'tableHead');
      if (tableHead && tableHead.children.length) {
        const newHeaderPath = [...tablePath, table.children.indexOf(tableHead), 0, newIndex];
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
          newIndex,
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

  addRow(editor, position = 'end') {
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

    // Find the currently selected row
    const rowMatch = Editor.above(editor, { match: (n) => n.type === 'tableRow' });

    let newIndex;
    if (position === 'end') newIndex = tableBody.children.length;
    if (position === 'start') newIndex = 0;
    else if (position === 'before' && rowMatch) {
      const [, rowPath] = rowMatch;
      const rowIndex = rowPath[rowPath.length - 1];
      newIndex = rowIndex;
    } else if (position === 'after' && rowMatch) {
      const [, rowPath] = rowMatch;
      const rowIndex = rowPath[rowPath.length - 1];
      newIndex = rowIndex + 1;
    }

    // Define the path to the new row
    const newRowPath = [...tablePath, table.children.indexOf(tableBody), newIndex];

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

  selectCellUp(editor) {
    const tableMatch = Editor.above(editor, { match: (n) => n.type === 'table' });
    if (!tableMatch) {
      return; // If not in a table, do nothing
    }
    // If there is no tablebody, we are in the head and there's no way to go up
    const bodyMatch = Editor.above(editor, { match: (n) => n.type === 'tableBody' });
    if (!bodyMatch) return;

    const [body, bodyPath] = bodyMatch;
    const rowMatch = Editor.above(editor, { match: (n) => n.type === 'tableRow' });
    const [row] = rowMatch;
    const rowIndex = body.children.indexOf(row);
    const cellMatch = Editor.above(editor, { match: (n) => n.type === 'tableCell' });
    const [cell] = cellMatch;
    const cellIndex = row.children.indexOf(cell);
    if (rowIndex === 0) {
      //We are in the top row, so we need to move to the head
      const [table, tablePath] = tableMatch;
      const tableHeadIndex = table.children.findIndex((child) => child.type === 'tableHead');
      const newPath = [...tablePath, tableHeadIndex, 0, cellIndex, 0];
      Transforms.select(editor, newPath);
      Transforms.collapse(editor);
      return;
    } else {
      const newPath = [...bodyPath, rowIndex - 1, cellIndex, 0];
      Transforms.select(editor, newPath);
      Transforms.collapse(editor);
      return;
    }
  },

  selectCellDown(editor) {
    const tableMatch = Editor.above(editor, { match: (n) => n.type === 'table' });
    if (!tableMatch) {
      return; // If not in a table, do nothing
    }
    const bodyMatch = Editor.above(editor, { match: (n) => n.type === 'tableBody' });
    const cellMatch = Editor.above(editor, { match: (n) => n.type === 'tableCell' || n.type === 'tableHeader' });
    const [cell] = cellMatch;
    const rowMatch = Editor.above(editor, { match: (n) => n.type === 'tableRow' });
    const [row] = rowMatch;
    const cellIndex = row.children.indexOf(cell);
    // If there is no tablebody, we are in the head and we have to go to the body to go down

    if (!bodyMatch) {
      const [table, tablePath] = tableMatch;
      const bodyIndex = table.children.findIndex((child) => child.type === 'tableBody');
      const newPath = [...tablePath, bodyIndex, 0, cellIndex, 0];
      Transforms.select(editor, newPath);
      Transforms.collapse(editor);
      return;
    } else {
      const [body, bodyPath] = bodyMatch;
      const rowIndex = body.children.indexOf(row);
      if (rowIndex < body.children.length - 1) {
        const newPath = [...bodyPath, rowIndex + 1, cellIndex, 0];
        Transforms.select(editor, newPath);
        Transforms.collapse(editor);
        return;
      } else {
        // We are at the bottom of the table, go to the next node
        const [table] = tableMatch;
        const tableIndex = editor.children.indexOf(table);
        if (tableIndex < editor.children.length - 1) {
          const newPath = [tableIndex + 1, 0];
          Transforms.select(editor, newPath);
          Transforms.collapse(editor);
          return;
        } else {
          Transforms.insertNodes(
            editor,
            { type: 'paragraph', children: [{ text: '' }] },
            { at: [tableIndex + 1], select: true }
          );
        }
      }
    }
  },

  selectNextCell(editor) {
    const tableMatch = Editor.above(editor, { match: (n) => n.type === 'table' });
    if (!tableMatch) {
      return; // If not in a table, do nothing
    }

    const [table, tablePath] = tableMatch;
    const rowMatch = Editor.above(editor, { match: (n) => n.type === 'tableRow' });
    const [row, rowPath] = rowMatch;
    const [cell] = Editor.above(editor, { match: (n) => n.type === 'tableCell' || n.type === 'tableHeader' });
    const cellIndex = row.children.indexOf(cell);
    if (cellIndex < row.children.length - 1) {
      const newPath = [...rowPath, cellIndex + 1, 0];
      Transforms.select(editor, newPath);
      return;
    }
    // Otherwise, we are at the right end of the row. Check if there is a row after
    const tableBodyHeadMatch = Editor.above(editor, { match: (n) => n.type === 'tableBody' || n.type === 'tableHead' });
    const [tableBodyOrHead, tableBodyOrHeadPath] = tableBodyHeadMatch;
    if (tableBodyOrHead.type === 'tableBody') {
      const tableBody = tableBodyOrHead;
      const rowIndex = tableBody.children.indexOf(row);
      if (rowIndex < tableBody.children.length - 1) {
        const newPath = [...tableBodyOrHeadPath, rowIndex + 1, 0, 0];
        Transforms.select(editor, newPath);
        return;
      }
    } else if (tableBodyOrHead.type === 'tableHead') {
      //We are at the right end of the table head. We want to select the first cell of the first row
      const tableBodyIndex = table.children.findIndex((child) => child.type === 'tableBody');
      const newPath = [...tablePath, tableBodyIndex, 0, 0, 0];
      Transforms.select(editor, newPath);
      return;
    }
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
