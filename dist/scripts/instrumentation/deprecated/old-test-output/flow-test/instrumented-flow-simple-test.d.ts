/**
 * Simple Flow Test File
 *
 * This file tests basic Flow features for initial performance testing.
 */
declare function greet(name: any): string;
declare function greet(name: any, greeting?: string): string;
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
declare function isActive(user: any): boolean;
declare namespace user {
    let id: number;
    let name: string;
    let isActive: boolean;
}
