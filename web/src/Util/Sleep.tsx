export const Sleep: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms));
