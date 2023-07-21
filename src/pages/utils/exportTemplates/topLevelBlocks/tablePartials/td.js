const td = `
    <td>
        {{#each children}}
            {{~> block-content this}}
        {{/each}}
    </td>
`;
export default td;
