const vaporLight = `
@media screen {
    body {
      background-color: #E6ECF0;
      color: #212121;
    }
  
    a.article-link {
      color: #049DF3;
    }
  
    a.keyword-link {
      color: #E3256B;
    }
    table {
      background-color: #E6ECF0;
    }
  
    tbody tr:nth-of-type(even) {
      background-color: #C9DBF0;
    }
  
    tbody tr:nth-of-type(odd) {
      background-color: #D7EBF5;
    }
  
  }
  @media print {
  
    a.article-link {
      color: #a14979;
    }
  
    a.keyword-link {
      color: #582c18;
    }
  
  }
`;
export default vaporLight;
