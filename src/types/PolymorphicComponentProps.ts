import {ElementType, ComponentPropsWithoutRef} from "react";


type AsProp<T extends ElementType> = {
    as?: T;
};

type PropsToOmit<T extends ElementType, P> = keyof (AsProp<T> & P);

export type PolymorphicComponentProps<
    T extends ElementType,
    Props = {}
> = Props & AsProp<T> & Omit<ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>;