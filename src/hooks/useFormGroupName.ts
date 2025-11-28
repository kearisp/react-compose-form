import {useMemo, useContext} from "react";
import {FormGroupContext} from "../contexts";
import {joinDotNotation} from "../utils";


export const useFormGroupName = (name: string) => {
    const {
        name: parent = ""
    } = useContext(FormGroupContext);

    return useMemo(() => {
        return joinDotNotation(parent, name);
    }, [parent, name]);
};
