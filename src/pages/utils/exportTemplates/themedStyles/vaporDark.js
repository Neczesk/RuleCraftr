const vaporLight = `
@media screen {
    body {
      background-color: #00141F;
      color: #F0F0F0;
      margin: auto;
      max-width: 960px;
    }
  
    h4.table-of-contents-entry > a {
      color: inherit;
    }
  
    a.article-link {
      color: #8FA7FF;
    }
  
    a.keyword-link {
      color: #DB0037;
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
