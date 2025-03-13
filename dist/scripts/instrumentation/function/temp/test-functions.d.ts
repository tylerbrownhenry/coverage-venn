declare function add(a: number, b: number): number;
declare function add(a: any, b: any): any;
declare function add(a: any, b: any): any;
declare function greet(name: any): string;
declare function greet(name: any, greeting?: string): string;
declare function sum(...numbers: any[]): any;
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
declare function outer(x: any): any;
declare function processData(data: any): any;
declare function multiply(a: any, b: any): number;
declare function getFullName(first: any, last: any): string;
declare function createPerson(name: any, age: any): {
    name: any;
    age: any;
};
declare function factorial(n: any): any;
declare function divide(a: any, b: any): number;
declare const result: number;
