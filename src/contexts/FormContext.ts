import {useContext, createContext} from "react";
import {UseFormReturn} from "react-hook-form";


export type FormContextType = {
    registry: Map<string, UseFormReturn>;
    getForm: (id: string) => UseFormReturn | undefined;
    registerForm: (id: string, props: UseFormReturn) => void;
    unregisterForm: (id: string) => void;
};

export const FormContext = createContext<FormContextType>({
    registry: new Map(),
    getForm() {
        return undefined;
    },
    registerForm() {},
    unregisterForm() {}
});

export const useFormContext = () => useContext(FormContext);
