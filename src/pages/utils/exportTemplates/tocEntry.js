const tocEntry = `
    {{~#unless childrenArticles~}}
        <h4 class="table-of-contents-entry"><a href="#{{id}}">{{title}}</a></h4>
    {{~/unless~}}
    {{~#if childrenArticles~}}
        <h4 class="table-of-contents-entry"><a href="#{{id}}">{{title}}</a></h4>
        <ol>
            {{~#each childrenArticles~}}
                <li>{{> toc-entry this}}</li>
            {{~/each~}}
        </ol>
    {{~/if~}}
`;
export default tocEntry;
