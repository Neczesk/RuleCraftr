export const GenstaffEditor = (editor) => {
    const {isInline, isVoid} = editor

    editor.isInline = (element) => {
        if (element.type === 'keyword') return true
        if (element.type === 'articleRef') return true
        return isInline(element)
    }

    editor.isVoid = (element) => {
        if (element.type === 'keyword') return true
        if (element.type === 'articleRef') return true
        return isVoid(element)
    }
    return editor
}