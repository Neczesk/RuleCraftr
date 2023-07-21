const vaporLight = `
@media screen {
    body {
      background-color: #00141F;
      color: #F0F0F0;
    }
  
    a.article-link {
      color: #8FA7FF;
    }
  
    a.keyword-link {
      color: #DB0037;
    }

    table {
      background-color: #00141F;
    }
  
    tbody tr:nth-of-type(even) {
      background-color: #2B1217;
    }
  
    tbody tr:nth-of-type(odd) {
      background-color: #002336;
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
