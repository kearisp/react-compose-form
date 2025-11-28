import {useContext} from "react";
import {UseFieldArrayReturn, FieldValues, ArrayPath} from "react-hook-form";
import {FormArrayContext} from "../contexts";


export const useFormArray = <
    T extends FieldValues = FieldValues,
    P extends ArrayPath<T> = ArrayPath<T>,
    K extends string = "id"
>() => useContext(FormArrayContext) as UseFieldArrayReturn<T, P, K>;
