/**
 * Pure TypeScript Test File (No React)
 *
 * This file tests various TypeScript features with our instrumentation plugin.
 */
interface User {
    id: number;
    name: string;
    isActive: boolean;
    metadata?: Record<string, unknown>;
}
type UserRole = 'admin' | 'user' | 'guest';
type UserWithRole = User & {
    role: UserRole;
};
declare enum Status {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Pending = "PENDING"
}
type Result<T> = {
    data?: T;
    error?: string;
    status: 'success' | 'error' | 'loading';
};
type UserKeys = keyof User;
type Optional<T> = {
    [K in keyof T]?: T[K];
};
type NonNullableFields<T> = {
    [K in keyof T]: NonNullable<T[K]>;
};
declare const getActiveUsers: (users: User[]) => User[];
type Alignment = 'left' | 'right' | 'center';
type VerticalAlignment = 'top' | 'middle' | 'bottom';
type Position = `${Alignment}-${VerticalAlignment}`;
type UserId = number & {
    readonly __brand: unique symbol;
};
