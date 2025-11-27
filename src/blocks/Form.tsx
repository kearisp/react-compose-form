import React, {
    useRef,
    useCallback,
    FormEvent,
    ComponentType,
    PropsWithChildren,
    JSX,
    HTMLAttributes
} from "react";
import {
    useForm,
    FormProvider,
    UseFormProps,
    FieldValues,
    SubmitHandler,
    SubmitErrorHandler
} from "react-hook-form";

export type FormComponentProps<P = unknown> = P & PropsWithChildren<{
    className?: string;
    onSubmit?: (e: FormEvent) => void;
}>;

export type FormProps<T extends FieldValues = FieldValues, C = any, P = unknown> = PropsWithChildren<
    UseFormProps<T, C> & Omit<P, "onSubmit"> & {
        as?: ComponentType<FormComponentProps<P>> | keyof JSX.IntrinsicElements;
        onSubmit?: SubmitHandler<T>;
        onInvalid?: SubmitErrorHandler<T>;
    }
>;

export const Form = <
    T extends FieldValues = FieldValues,
    C = any,
    P = HTMLAttributes<HTMLFormElement>
>(props: FormProps<T, C, P>) => {
    const {
        as: Component = "form",
        mode,
        disabled,
        reValidateMode,
        defaultValues,
        values,
        resetOptions,
        resolver,
        errors,
        context,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        progressive,
        criteriaMode,
        delayError,
        formControl,
        children,
        onSubmit,
        onInvalid,
        ...rest
    } = props;

    const formProps = useForm<T, C>({
        mode,
        disabled,
        reValidateMode,
        defaultValues,
        values,
        resetOptions,
        resolver,
        errors,
        context,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        progressive,
        criteriaMode,
        delayError,
        formControl
    });
    const submitRef = useRef(onSubmit),
          invalidRef = useRef(onInvalid);

    submitRef.current = onSubmit;
    invalidRef.current = onInvalid;

    const handleSubmit: SubmitHandler<T> = useCallback((data: T, event) => {
        if(submitRef.current) {
            return submitRef.current(data, event);
        }
    }, []);

    const handleInvalid: SubmitErrorHandler<T> = useCallback((errors, event) => {
        if(invalidRef.current) {
            return invalidRef.current(errors, event);
        }
    }, []);

    return (
        <FormProvider<T> {...formProps}>
            <Component
              {...rest as P}
              onSubmit={formProps.handleSubmit(handleSubmit, handleInvalid)}>
                {children}
            </Component>
        </FormProvider>
    );
};
