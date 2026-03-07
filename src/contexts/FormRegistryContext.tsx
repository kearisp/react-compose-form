import {useCallback, useSyncExternalStore} from "react";
import {UseFormReturn} from "react-hook-form";


const formMap = new Map<string, UseFormReturn>();

export const useFormRegistry = () => {
    const subscribe = useCallback(() => {

    }, []);


};
