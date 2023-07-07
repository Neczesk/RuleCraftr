const blockContentTemplate = `
        {{~#if type~}}
            {{~inline-node type id~}}
        {{~/if~}}
        {{~#unless type~}}
            <span class="
            {{~#if underline~}}
                underlined
            {{~/if~}}
            ">
            {{~#if bold~}}
                <strong>
            {{~/if~}}
            {{~#if italic~}}
                <em>
            {{~/if~}}
            {{~text~}}
            {{~#if italic~}}
                </em>
            {{~/if~}}
            {{~#if bold~}}
                </strong>
            {{~/if~}}
            </span>
        {{~/unless~}}
    `;
export default blockContentTemplate;
