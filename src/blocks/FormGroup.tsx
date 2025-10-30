import React, {PropsWithChildren} from "react";
import {FormGroupContext, useFormGroupName} from "./FormGroupContext";


export type FormGroupProps = PropsWithChildren<{
    name: string;
}>;

export const FormGroup: React.FC<FormGroupProps> = (props) => {
    const {
        name,
        children
    } = props;

    const fullName = useFormGroupName(name);

    return (
        <FormGroupContext.Provider
          value={{
            name: fullName
          }}>
            {children}
        </FormGroupContext.Provider>
    );
};
