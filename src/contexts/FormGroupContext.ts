import {createContext} from "react";


export const FormGroupContext = createContext<{
    name?: string;
}>({});
