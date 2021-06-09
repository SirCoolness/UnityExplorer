export const GetType: (t: any) => Function = t => t.__proto__.constructor;
