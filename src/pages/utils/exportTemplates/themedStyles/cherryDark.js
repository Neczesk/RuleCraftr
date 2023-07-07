const cherryDark = `
@media screen {
    body {
      background-color: #1f1819;
      color: #F0F0F0;
      margin: auto;
      max-width: 960px;
    }
  
    h4.table-of-contents-entry > a {
      color: inherit;
    }
  
    a.article-link {
      color: #ff9eb1;
    }
  
    a.keyword-link {
      color: #D1AB88;
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
      margin: auto;
      max-width: 960px;
    }
  
    h4.table-of-contents-entry > a {
      color: inherit;
    }
  
    a.article-link {
      color: #a14979;
    }
  
    a.keyword-link {
      color: #582c18;
    }
  
    .article-title {
      text-align: center;
    }
  
    .underlined {
      text-decoration: underline;
    }
  }
`;
export default cherryDark;
