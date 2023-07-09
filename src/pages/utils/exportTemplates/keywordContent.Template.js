const keywordContentTemplate = `
    <h4 id="{{id}}" >{{keyword}}</h6>
    <p class="keyword-short-description"><em>{{shortDefinition}}</em></p>
    {{~#each longDefinition~}}
        <{{~block-tag this~}}>
        {{~#each children~}}
            {{~> block-content this~}}
        {{~/each~}}
        </{{~closing-block-tag this~}}>
    {{/each}}
    `;
export default keywordContentTemplate;
