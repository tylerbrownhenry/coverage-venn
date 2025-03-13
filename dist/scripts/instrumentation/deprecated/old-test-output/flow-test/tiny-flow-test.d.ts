declare function greetUser(user: any): string;
declare function greetUser(user: User): string;
type User = {
    name: string;
    age: number;
};
declare const defaultUser: User;
declare const greeting: string;
