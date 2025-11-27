import React, {ComponentType} from "react";
import {
    useFormContext,
    Controller,
    ControllerRenderProps,
    Message,
    ValidationRule,
    ControllerFieldState
} from "react-hook-form";
import {useFormGroupName, FormControlContext} from "../contexts";


export type FormFieldProps<P = unknown> = P & Partial<ControllerRenderProps & ControllerFieldState>;

export type FormControlProps<P = unknown> = Omit<P, "as" | "name" | "disabled" | "required" | keyof ControllerFieldState | keyof ControllerRenderProps> & {
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
          render={({field, fieldState}) => {
            return (
                <FormControlContext value={fieldState}>
                    <Component
                      {...rest as P}
                      {...field} />
                </FormControlContext>
            );
          }} />
    );
};

