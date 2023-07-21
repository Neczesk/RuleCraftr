const theader = `
    <th style="width: {{width}}px;">
        {{#each children}}
            {{~> block-content this~}}
        {{/each}}
    </th>
`;
export default theader;
