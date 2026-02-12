import React, {ComponentType} from "react";
import {
    useFormContext,
    Control,
    Controller,
    ControllerProps,
    ControllerRenderProps,
    Message,
    ValidationRule,
    ControllerFieldState
} from "react-hook-form";
import {FormControlContext} from "../contexts";
import {useFormGroupName} from "../hooks";


const ControllerWithContext: React.FC<ControllerProps> = (props) => {
    const {control} = useFormContext();

    return (
        <Controller
          {...props}
          control={control} />
    );
};

export type FormFieldProps<P = unknown> = P & Partial<ControllerRenderProps & ControllerFieldState>;

export type FormControlProps<P = unknown> = Omit<P, "as" | "name" | "disabled" | "required" | keyof ControllerFieldState | keyof ControllerRenderProps> & {
    as?: ComponentType<FormFieldProps<P>>;
    name: string;
    disabled?: boolean;
    required?: Message | ValidationRule<boolean>;
    control?: Control;
};

export const FormControl = <P = unknown>(props: FormControlProps<P>) => {
    const {
        as: Component = "input" as unknown as ComponentType<FormFieldProps<P>>,
        name,
        disabled = false,
        required,
        control,
        ...rest
    } = props;

    const fullName = useFormGroupName(name);
    const C = control ? Controller : ControllerWithContext;

    return (
        <C
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
