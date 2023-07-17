import { useCallback } from 'react';
import { Transforms } from 'slate';
import {
  HeaderElement,
  CodeElement,
  KeywordLink,
  ArticleLink,
  DefaultElement,
  Leaf,
} from '../SlateComponents/elementComponents';
import RulesetEditor from './RulesetEditor';

export const GenstaffEditor = (editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    if (element.type === 'keyword') return true;
    if (element.type === 'articleRef') return true;
    return isInline(element);
  };

  editor.isVoid = (element) => {
    if (element.type === 'keyword') return true;
    if (element.type === 'articleRef') return true;
    return isVoid(element);
  };

  return editor;
};

export const useGenstaff = (
  editor,
  selectArticle,
  inspectKeyword,
  openArticleRefMenu,
  openKeywordRefMenu,
  saveArticle
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
    // if (event.key === 'Tab') {
    //   event.preventDefault();
    //   editor.insertText('\t');
    // }
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
