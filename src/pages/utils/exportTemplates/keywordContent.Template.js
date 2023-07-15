const keywordContentTemplate = `
    {{~#unless keyword.dummy~}}
    <h4 id="{{id}}" >{{keyword.keyword}}</h6>
    <p class="keyword-short-description"><em>{{shortDefinition}}</em></p>
    {{~#each longDefinition~}}
        <{{~block-tag this~}}>
        {{~#each children~}}
            {{~> block-content this~}}
        {{~/each~}}
        </{{~closing-block-tag this~}}>
    {{/each}}
    {{~/unless~}}
    `;
export default keywordContentTemplate;
