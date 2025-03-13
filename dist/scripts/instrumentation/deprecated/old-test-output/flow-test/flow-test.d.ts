declare function getUserStatus(user: User): string;
declare function getUserStatus(user: any): "Active" | "Inactive";
declare function getUserStatus(user: any): any;
declare function getUserStatus(user: User): Status;
declare function getUserStatus(user: any): any;
declare function getUserStatus(user: User): Status;
declare function fetchUserData(id: number): Promise<Result<User>>;
declare function fetchUserData(id: any): Promise<any>;
declare function fetchUserData(id: any): Promise<any>;
declare function fetchUserData(id: number): Promise<Result<User>>;
declare function fetchUserData(id: any): Promise<any>;
declare function fetchUserData(id: number): Promise<Result<User>>;
declare function filterItems<T>(items: Array<T>, predicate: (item: T) => boolean): Array<T>;
declare function filterItems(items: any, predicate: any): any;
declare function filterItems(items: any, predicate: any): any;
declare function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[];
declare function filterItems(items: any, predicate: any): any;
declare function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[];
declare function processUsers(users: Array<User>): Promise<Result<Array<User>>>;
declare function processUsers(_x: any, ...args: any[]): any;
declare function processUsers(_x: any, ...args: any[]): any;
declare function processUsers(users: User[]): Promise<Result<User[]>>;
declare function processUsers(_x: any, ...args: any[]): any;
declare function processUsers(users: User[]): Promise<Result<User[]>>;
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
declare function transformUserData<T, User>(user: T, transformer: <K, $Keys>() => <T_1>() => any): any;
declare function transformUserData(user: any, transformer: any): {};
declare function transformUserData(user: any, transformer: any): {};
declare function transformUserData<T extends User>(user: T, transformer: <K extends keyof T>(key: K, value: T[K]) => any): Record<string, any>;
declare function transformUserData(user: any, transformer: any): {};
declare function transformUserData<T extends User>(user: T, transformer: <K extends keyof T>(key: K, value: T[K]) => any): Record<string, any>;
declare function isActiveUser(user: mixed): boolean;
declare function isActiveUser(user: any): any;
declare function isActiveUser(user: any): any;
declare function isActiveUser(user: any): user is User & {
    isActive: true;
};
declare function isActiveUser(user: any): any;
declare function isActiveUser(user: any): user is User & {
    isActive: true;
};
declare function getUserDisplayName(user: User | null): string;
declare function getUserDisplayName(user: any): any;
declare function getUserDisplayName(user: any): any;
declare function getUserDisplayName(user?: User): string;
declare function getUserDisplayName(user: any): any;
declare function getUserDisplayName(user?: User): string;
declare function createLogger<T>(prefix: string): (data: T) => void;
declare function createLogger(prefix: any): (data: any) => void;
interface User {
    id: number;
    name: string;
    isActive: boolean;
    metadata?: {
        [key: string]: mixed;
    };
}
type UserRole = "user" | "admin" | "guest";
type UserWithRole = User & {
    role: UserRole;
};
type ExactUser = any;
type Result<T> = {
    data?: T | undefined;
    error?: string | undefined;
    status: "error" | "loading" | "success";
};
type UserKeys = $Keys<User>;
type Optional<T> = $Shape<T>;
type MaybeString = string | null;
declare function getActiveUsers(users: Array<User>): Array<User>;
