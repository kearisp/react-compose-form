import {createContext, useContext} from "react";


export const FormArrayItemContext = createContext<{
    index: number;
    remove: () => void;
    moveUp: () => void;
    moveDown: () => void;
}>({
    index: 0,
    remove() {},
    moveUp() {},
    moveDown() {}
});

export const useFormArrayItemContext = () => useContext(FormArrayItemContext);;
