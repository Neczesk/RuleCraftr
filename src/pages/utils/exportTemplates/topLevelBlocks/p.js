const paragraphPartial = `
<p class="body-paragraph>
{{~#each children~}}
    {{~> block-content this~}}
{{~/each~}}
</p>
`;
export default paragraphPartial;
