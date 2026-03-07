import React, {useState, useMemo, useCallback, PropsWithChildren} from "react";
import {UseFormReturn} from "react-hook-form";
import {FormContext, FormContextType} from "../contexts/FormContext";


type FormProviderProps = PropsWithChildren;

export const FormProvider: React.FC<FormProviderProps> = (props) => {
    const {
        children
    } = props;

    const [formMap, setFormMap] = useState(() => new Map<string, UseFormReturn>());

    const handleGetForm = useCallback((formId: string) => {
        return formMap.get(formId);
    }, [formMap]);

    const handleRegisterForm = useCallback((id: string, form: UseFormReturn) => {
        setFormMap((formMap) => {
            const newMap = new Map(formMap);

            newMap.set(id, form);

            return newMap;
        });
    }, []);

    const handleUnregisterForm = useCallback((id: string) => {
        setFormMap((map) => {
            const formMap = new Map(map);

            formMap.delete(id);

            return formMap;
        });
    }, []);

    const context = useMemo((): FormContextType => {
        return {
            registry: formMap,
            getForm: handleGetForm,
            registerForm: handleRegisterForm,
            unregisterForm: handleUnregisterForm
        };
    }, [formMap, handleGetForm, handleRegisterForm, handleUnregisterForm]);

    return (
        <FormContext value={context}>
            {children}
        </FormContext>
    );
};
