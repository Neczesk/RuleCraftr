const li = `
    {{~#if (eq type 'list')~}}
    {{~> list this~}}
    {{else}}
    <li>
        {{~#each children~}}
            {{~> block-content this}}
            
        {{~/each~}}
    </li>
    {{/if}}
`;
export default li;
