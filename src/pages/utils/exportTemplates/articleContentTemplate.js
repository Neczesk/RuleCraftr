const articleContentTemplate = `
    <h3 id="{{article.id}}" class="article-title">{{article.title}}</h3>
    {{~#each article.content~}}
        {{> (lookup . 'type') this}}
    {{/each}}
    `;
export default articleContentTemplate;
