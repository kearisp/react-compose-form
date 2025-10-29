import {useMemo, useContext, createContext} from "react";
import {joinDotNotation} from "../../utils";


export const FormGroupContext = createContext<{
    name?: string;
}>({});

export const useFormGroupName = (name: string = ""): string => {
    const {
        name: parentName = ""
    } = useContext(FormGroupContext);

    return useMemo(() => {
        return joinDotNotation(parentName, name);
    }, [parentName, name]);
};
