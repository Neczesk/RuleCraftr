const vaporLight = `
@media screen {
    body {
      background-color: #E6ECF0;
      color: #212121;
      margin: auto;
      max-width: 960px;
    }
  
    h4.table-of-contents-entry > a {
      color: inherit;
    }
  
    a.article-link {
      color: #049DF3;
    }
  
    a.keyword-link {
      color: #E3256B;
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
export default vaporLight;
