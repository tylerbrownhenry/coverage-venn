declare function getDisplayName(user: User): string;
declare function getActiveUsers(users: Array<User>): Array<User>;
declare function getFirstItem<T>(items: Array<T>): T | null;
type UserID = string;
type UserStatus = "active" | "inactive" | "banned";
type User = {
    id: string;
    name: string;
    age: number;
    status: UserStatus;
    email?: string | undefined;
};
declare const users: Array<User>;
