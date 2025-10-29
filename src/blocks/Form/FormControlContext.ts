import {useContext, createContext} from "react";
import {ControllerFieldState} from "react-hook-form";


export const FormControlContext = createContext<ControllerFieldState>({
    invalid: false,
    isDirty: false,
    isTouched: false,
    isValidating: false
});

export const useFormControl = () => useContext(FormControlContext);
