const rootStyle = `
@media screen {
    body {
      word-break: break-all;
      hyphens: auto;
      margin: auto;
      max-width: 960px;
    }
  
    h4.table-of-contents-entry > a {
      color: inherit;
    }

    p.body-paragraph {
        text-indent: 1.5em;
    }
  
    .article-title {
        text-decoration: underline;
    }
  
    .underlined {
      text-decoration: underline;
    }
  }
  @media print {
    body {
      word-break: break-all;
      hyphens: auto;
      margin: auto;
      max-width: 960px;
    }

    p.body-paragraph {
        text-indent: 1.5em;
    }
  
    h4.table-of-contents-entry > a {
      color: inherit;
    }
  
    .article-title {
      text-align: center;
    }
  
    .underlined {
      text-decoration: underline;
    }
  }
`;
export default rootStyle;
