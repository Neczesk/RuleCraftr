const h2Partial = `
<h3 class="article-header">
{{~#each children~}}
    {{~> block-content this~}}
{{~/each~}}
</h3>
`;
export default h2Partial;
