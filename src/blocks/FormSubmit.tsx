import React, {ElementType} from "react";
import {Control, useFormContext} from "react-hook-form";
import {PolymorphicComponentProps} from "../types/PolymorphicComponentProps";


type FormSubmitProps<T extends ElementType = "button"> = PolymorphicComponentProps<T, {
    control?: Control;
}>;

export const FormSubmit = <T extends ElementType = "button">(props: FormSubmitProps<T>) => {
    const Component = props.control ? SubmitWrapper : SubmitWrapperWithContext;

    return (
        <Component
          {...props}
          control={props.control!} />
    );
};

const SubmitWrapperWithContext = <T extends ElementType = "button">(props: FormSubmitProps<T>) => {
    const {
        control
    } = useFormContext();

    return (
        <SubmitWrapper
          {...props}
          control={control} />
    );
};

type SubmitWrapperProps<T extends ElementType = "button"> = PolymorphicComponentProps<T, {
    control: Control;
}>;

const SubmitWrapper = <T extends ElementType = "button">(props: SubmitWrapperProps<T>) => {
    const {
        as: Component = "button",
        control,
        ...rest
    } = props;

    return (
        <Component {...rest} />
    );
};
