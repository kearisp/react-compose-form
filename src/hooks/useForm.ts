import {useFormContext as useHookContext, FieldValues, UseFormReturn} from "react-hook-form";
import {useFormContext} from "../contexts/FormContext";


export const useForm = <
    V extends FieldValues = FieldValues
>(formId?: string): UseFormReturn<V> => {
    const {
        registry
    } = useFormContext();

    if(formId) {
        const form = registry.get(formId);

        if(!form) {
            throw new Error(`Form "${formId}" is not registered yet`);
        }

        return form as UseFormReturn<V>;
    }

    return useHookContext<V>();
};
