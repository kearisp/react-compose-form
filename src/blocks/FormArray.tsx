import React, {isValidElement, cloneElement, Children, PropsWithChildren, ComponentType, ElementType} from "react";
import {useFieldArray} from "react-hook-form";
import {FormGroup} from "./FormGroup";
import {useFormGroupName, FormArrayContext, FormArrayItemContext} from "../contexts";


export type FormArrayProps = PropsWithChildren<{
    as?: ComponentType<PropsWithChildren> | ElementType<PropsWithChildren>;
    name: string;
}>;

export const FormArray: React.FC<FormArrayProps> = (props) => {
    const {
        as: Component = React.Fragment,
        name,
        children
    } = props;

    const fullName = useFormGroupName(name);

    const array = useFieldArray({
        name: fullName
    });

    return (
        <FormGroup name={name}>
            <FormArrayContext.Provider value={array}>
                <Component>
                    {array.fields.map((field, index) => {
                        return (
                            <FormGroup
                              key={field.id}
                              name={index.toString()}>
                                <FormArrayItemContext.Provider
                                  value={{
                                    index,
                                    remove: () => array.remove(index),
                                    moveUp: () => {
                                        if(index - 1 >= 0) {
                                            array.swap(index, index - 1);
                                        }
                                    },
                                    moveDown: () => {
                                        if(index + 1 < array.fields.length) {
                                            array.swap(index, index + 1);
                                        }
                                    }
                                  }}>
                                    {Children.map(children, (child, index) => {
                                        if(!isValidElement(child)) {
                                            return null;
                                        }

                                        return cloneElement(child, {
                                            key: index.toString()
                                        });
                                    })}
                                </FormArrayItemContext.Provider>
                            </FormGroup>
                        );
                    })}
                </Component>
            </FormArrayContext.Provider>
        </FormGroup>
    );
};
