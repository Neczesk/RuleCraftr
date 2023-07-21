const theadrow = `
    <tr>
        {{~#each children~}}
            {{> theader this}}
        {{/each}}
    </tr>
`;
export default theadrow;
