export type Defined<T> = T extends null | undefined ? never : T;
