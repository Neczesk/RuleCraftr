const cherryLight = `
@media screen {
    body {
      background-color: #faf7f8;
      color: #212121;
    }

    a.article-link {
      color: #a14979;
    }
  
    a.keyword-link {
      color: #582c18;
    }

    table {
      background-color: #FAF7F8;
    }
  
    tbody tr:nth-of-type(even) {
      background-color: #FFF0F5;
    }
  
    tbody tr:nth-of-type(odd) {
      background-color: #EED3D9;
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
export default cherryLight;
