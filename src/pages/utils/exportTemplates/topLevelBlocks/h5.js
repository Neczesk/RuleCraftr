const h5Partial = `
<h5 class="article-header">
{{~#each children~}}
    {{~> block-content this~}}
{{~/each~}}
</h5>
`;
export default h5Partial;
