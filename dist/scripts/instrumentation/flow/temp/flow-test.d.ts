declare function getMiddleName(fullName: string): string | null;
declare function ItemList(props: Props): {
    type: string;
    props: {
        className: string;
    };
    children: {
        type: string;
        props: {};
        children: any;
    }[];
};
declare function processUser(user: User): string | null;
declare function processUser(user: any): string;
declare function processUser(user: any): any;
declare function processUser(user: any): any;
declare function processUser(user: User): string | null;
declare function processUser(user: ExactUser): string;
declare function processUser({ name, age }: {
    name: any;
    age: any;
}): string;
declare function processUser(user: any): any;
declare function processUser(user: User): string | null;
declare const count: number;
declare const name: string;
declare const isEnabled: boolean;
declare const nothing: null;
declare const missing: void;
type Alignment = "center" | "left" | "right";
declare const textAlign: Alignment;
type ExactUser = any;
declare const numbers: Array<number>;
declare const userInfo: [string, number, boolean];
type CallbackFn = (error: Error | null, result: Object | null) => void;
type DataProcessor = (data: string) => Promise<Object>;
declare class Container<T> {
    constructor(value: T);
    value: T;
    getValue(): T;
}
type Id = string | number;
type Named = {
    name: string;
};
type Timestamped = {
    createdAt: Date;
};
type NamedAndTimestamped = Named & Timestamped;
declare const userId: HTMLElement | null;
declare const any: any;
declare const HTMLInputElement: any;
type Keys = $Keys<any>;
type Values = $Values<any>;
type Optional = $Shape<any>;
type Props = any;
declare const testUser: ExactUser;
declare const numberContainer: boolean;
