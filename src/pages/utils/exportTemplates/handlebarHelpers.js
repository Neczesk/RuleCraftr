import Handlebars from 'handlebars';

function handlebarHelpers(helperName, otherArticles, keywords) {
  function blockTag(block) {
    const { type } = block;
    let tag;
    switch (type) {
      case 'paragraph':
        tag = 'p class="body-paragraph"';
        break;
      case 'h1':
        tag = 'h3 class="article-header"';
        break;
      case 'h2':
        tag = 'h3 class="article-header"';
        break;
      case 'h3':
        tag = 'h3 class="article-header"';
        break;
      case 'h4':
        tag = 'h4 class="article-header"';
        break;
      case 'h5':
        tag = 'h5 class="article-header"';
        break;
      case 'h6':
        tag = 'h6 class="article-header"';
        break;
      default:
        tag = 'div';
    }
    return new Handlebars.SafeString(tag);
  }
  function closingBlockTag(block) {
    const { type } = block;
    let tag;
    switch (type) {
      case 'paragraph':
        tag = 'p';
        break;
      case 'h1':
        tag = 'h3';
        break;
      case 'h2':
        tag = 'h3';
        break;
      case 'h3':
        tag = 'h3';
        break;
      case 'h4':
        tag = 'h4';
        break;
      case 'h5':
        tag = 'h5';
        break;
      case 'h6':
        tag = 'h6';
        break;
      default:
        tag = 'div';
    }
    return new Handlebars.SafeString(tag);
  }

  function inlineNode(type, id) {
    let output;
    switch (type) {
      case 'articleRef': {
        const refArticle = otherArticles.find((article) => article.id == id);
        output = `<a class="article-link" href="#${id}">${refArticle ? refArticle.title : 'Article Missing'}</a>`;
        break;
      }
      case 'keyword': {
        const refKeyword = keywords.find((keyword) => keyword.id == id);
        output = `<a class="keyword-link" href="#${id}">${refKeyword ? refKeyword.keyword : 'Keyword Missing'}</a>`;
        break;
      }
      case 'tab': {
        output = `<span style="padding-left: 1em; padding-right: 1em;"/>`;
        break;
      }
      default:
        break;
    }
    output = new Handlebars.SafeString(output);
    return output;
  }

  switch (helperName) {
    case 'inline-node':
      return inlineNode;
    case 'block-tag':
      return blockTag;
    case 'closing-block-tag':
      return closingBlockTag;
  }
}

export default handlebarHelpers;
