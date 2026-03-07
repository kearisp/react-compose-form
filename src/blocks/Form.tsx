import React, {
    useRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    ElementType
} from "react";
import {
    useForm,
    FormProvider,
    UseFormProps,
    UseFormReturn,
    FieldValues,
    SubmitHandler,
    SubmitErrorHandler
} from "react-hook-form";
import {useFormContext} from "../contexts/FormContext";
import {PolymorphicComponentProps} from "../types/PolymorphicComponentProps";


type FormProps<
    T extends FieldValues = FieldValues,
    C extends ElementType = "form"
> = PolymorphicComponentProps<C, UseFormProps<T, C> & {
    onSubmit?: SubmitHandler<T>;
    onInvalid?: SubmitErrorHandler<T>;
}>;

export const Form = <
    T extends FieldValues = FieldValues,
    C extends ElementType = "form"
>(props: FormProps<T, C>) => {
    const {
        id,
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

    const {
        registry,
        registerForm,
        unregisterForm
    } = useFormContext();

    const form = useForm<T>({
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

    if(id && !registry.has(id)) {
        registry.set(id, form as UseFormReturn);
    }

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

    useEffect(() => {
        if(!id) {
            return;
        }

        registerForm(id, form as UseFormReturn);
    }, [registerForm, id, form, form.formState.isSubmitting]);

    useLayoutEffect(() => {
        if(!id) {
            return;
        }

        return () => {
            unregisterForm(id);
        };
    }, []);

    return (
        <FormProvider<T> {...form}>
            <Component
              {...rest}
              id={id}
              onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}>
                {children}
            </Component>
        </FormProvider>
    );
};
