import React, {useRef, useCallback, FormEvent, ElementType, ComponentType, PropsWithChildren} from "react";
import {
    useForm,
    FormProvider,
    UseFormProps,
    FieldValues,
    SubmitHandler,
    SubmitErrorHandler
} from "react-hook-form";

type FormComponentProps = {
    className?: string;
    onSubmit?: (e: FormEvent) => void;
};

export type FormProps<T extends FieldValues = FieldValues, C = any> = PropsWithChildren<
    UseFormProps<T, C> & {
        as?: ElementType<FormComponentProps> | ComponentType<FormComponentProps>;
        className?: string;
        onSubmit?: SubmitHandler<T>;
        onInvalid?: SubmitErrorHandler<T>;
    }
>;

export const Form = <T extends FieldValues = FieldValues, C = any>(props: FormProps<T, C>) => {
    const {
        as: Component = "form",
        className,
        children,
        onSubmit,
        onInvalid,
        ...rest
    } = props;

    const formProps = useForm<T, C>(rest),
          submitRef = useRef(onSubmit),
          invalidRef = useRef(onInvalid);

    submitRef.current = onSubmit;
    invalidRef.current = onInvalid;

    const handleSubmit: SubmitHandler<T> = useCallback((data: T, event) => {
        if(submitRef.current) {
            submitRef.current(data, event);
        }
    }, []);

    const handleInvalid: SubmitErrorHandler<T> = useCallback((errors, event) => {
        if(invalidRef.current) {
            invalidRef.current(errors, event);
        }
    }, []);

    return (
        <FormProvider<T> {...formProps}>
            <Component
              className={className}
              onSubmit={formProps.handleSubmit(handleSubmit, handleInvalid)}>
                {children}
            </Component>
        </FormProvider>
    );
};
