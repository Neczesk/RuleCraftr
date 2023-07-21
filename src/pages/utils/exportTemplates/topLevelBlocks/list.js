const list = `
{{#if (eq subtype 'ordered')}}
  <ol>
    {{#each children}}
      {{> li this}}
    {{/each}}
  </ol>
{{else}}
  <ul>
    {{#each children}}
      {{> li this}}
    {{/each}}
  </ul>
{{/if}}
`;
export default list;
