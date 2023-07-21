const thead = `
    <thead>
        {{~#each children~}}
            {{> theadrow this}}
        {{~/each}}
    </thead>
`;
export default thead;
