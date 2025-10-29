import React, {ComponentType} from "react";
import {
    useFormContext,
    Controller,
    ControllerRenderProps,
    Message,
    ValidationRule,
} from "react-hook-form";
import {useFormGroupName} from "./FormGroupContext";


export type FormFieldProps<P = unknown> = P & Partial<ControllerRenderProps>;

export type FormControlProps<P = unknown> = P & {
    as?: ComponentType<FormFieldProps<P>>;
    name: string;
    disabled?: boolean;
    required?: Message | ValidationRule<boolean>;
};

export const FormControl = <P = unknown>(props: FormControlProps<P>) => {
    const {
        as: Component = "input" as unknown as ComponentType<FormFieldProps<P>>,
        name,
        disabled = false,
        required,
        ...rest
    } = props;

    const {control} = useFormContext();
    const fullName = useFormGroupName(name);

    return (
        <Controller
          control={control}
          disabled={disabled}
          name={fullName}
          rules={{
            required
          }}
          render={({field}) => {
            return (
                <Component
                  {...rest as P}
                  {...field} />
            );
          }} />
    );
};

