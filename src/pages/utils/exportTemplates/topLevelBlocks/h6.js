const h6Partial = `
<h6 class="article-header">
{{~#each children~}}
    {{~> block-content this~}}
{{~/each~}}
</h6>
`;
export default h6Partial;
