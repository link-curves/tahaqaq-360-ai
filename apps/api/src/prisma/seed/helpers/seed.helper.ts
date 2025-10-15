export const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const shuffle = <T>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

