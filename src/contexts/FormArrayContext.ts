import {createContext} from "react";
import {UseFieldArrayReturn} from "react-hook-form";


export const FormArrayContext = createContext<UseFieldArrayReturn>({
    fields: [],
    swap() {},
    remove() {},
    append() {},
    move() {},
    insert() {},
    prepend() {},
    update() {},
    replace() {}
});
