const h4Partial = `
<h4 class="article-header">
{{~#each children~}}
    {{~> block-content this~}}
{{~/each~}}
</h4>
`;
export default h4Partial;
