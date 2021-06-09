function isString(arg: any): arg is string {
    return typeof arg === "string"
}

export const LookupObject: <TReturn>(path: string | string[], target: any) => TReturn | undefined = (path, target) => {
    if (isString(path) && path.length)
    {
        if (path === ".")
            return target;

        path = path.split(".");
    } else if (!path.length)
        return target;

    if (path[0] === "")
        return LookupObject(path.slice(1), target);

    const key = (path as string[]).shift() as string;
    const value = target[key];

    if (!path.length)
        return value;

    return LookupObject(path, value);
}
