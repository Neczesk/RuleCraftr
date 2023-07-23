const articleContentTemplate = `
    <h3 id="{{article.id}}" class="article-title">{{article.title}}</h3>
    {{~#unless is_folder}}
    {{~#each article.content~}}
        {{> (lookup . 'type') this}}
    {{/each}}
    {{~/unless~}}
    `;
export default articleContentTemplate;
