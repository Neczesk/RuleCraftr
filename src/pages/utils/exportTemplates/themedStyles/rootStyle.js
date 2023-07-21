const rootStyle = `
@media screen {
    body {
      wordWrap: break-word;
      overflow: auto;
      overflow-wrap: break-word;
      word-break: normal;
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

    table {
      border: 1px solid black;
      border-collapse: collapse;
      overflow-x: auto;
    }

    th {
      border: solid 1px black;
    }
  
    td {
      border: solid 1px black;
      padding-top: 2px;
      padding-bottom: 2px;
      padding-right: 4px;
      padding-left: 4px
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
