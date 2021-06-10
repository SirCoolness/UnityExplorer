import { useMemo, useState } from 'react';

/**
 * a getter and setter that doesnt follow the react lifecycle
 */
//@ts-ignore
export const useGetterSetter: <
    T,
    L extends boolean | undefined = boolean | undefined
    >(
    start?: T,
    lifecycle?: L
) => [() => T, (value: T) => void, L extends true ? T : null] = (
    start,
    lifecycle
) => {
    const [value, setValue] = useState(start);

    const [getValue, setValueDirect] = useMemo(() => {
        let value: any = start;

        return [
            () => value,
            (input: any) => {
                value = input;
                if (lifecycle) setValue(input);
            }
        ];
    }, [lifecycle]);

    return useMemo(() => {
        return [getValue, setValueDirect, lifecycle ? value : null];
    }, [lifecycle ? value : false]);
};
