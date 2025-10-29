import React, {useCallback, FormEvent, ComponentType, PropsWithChildren} from "react";
import {
    useForm,
    FormProvider,
    Resolver,
    FieldValues,
    Mode,
    DefaultValues
} from "react-hook-form";


export type FormProps<T extends FieldValues = FieldValues> = PropsWithChildren<{
    as?: ComponentType<{
        className?: string;
        onSubmit: (e: FormEvent) => void;
    }>;
    className?: string;
    mode?: Mode;
    resolver?: Resolver<T>;
    values?: T;
    defaultValues?: DefaultValues<T>;
    onSubmit?: (data: T) => void;
    onError?: (err: unknown) => void;
}>;

export const Form = <T extends FieldValues = FieldValues>(props: FormProps<T>) => {
    const {
        as: Component = "form",
        className,
        mode,
        resolver,
        values,
        defaultValues,
        children,
        onSubmit,
        onError
    } = props;

    const formProps = useForm({
        mode,
        resolver,
        values,
        defaultValues
    });

    const handleSubmit = useCallback((data: any) => {
        if(onSubmit) {
            onSubmit(data);
        }
    }, [onSubmit]);

    return (
        <FormProvider {...formProps}>
            <Component
              className={className}
              onSubmit={formProps.handleSubmit(handleSubmit, onError)}>
                {children}
            </Component>
        </FormProvider>
    );
};
