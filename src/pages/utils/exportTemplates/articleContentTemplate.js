const articleContentTemplate = `
    <h3 id="{{article.id}}" class="article-title">{{article.title}}</h3>
    {{~#each article.content~}}
        <{{~block-tag this~}}>
        {{~#each children~}}
            {{~> block-content this~}}
        {{~/each~}}
        </{{~closing-block-tag this~}}>
    {{/each}}
    `;
export default articleContentTemplate;
