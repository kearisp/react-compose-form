export const joinDotNotation = (...names: string[]) => {
    return names.reduce((res: string[], name: string) => {
        return [
            ...res,
            ...name ? name.split(/(?<!\\)\./) : []
        ];
    }, []).join(".");
};
