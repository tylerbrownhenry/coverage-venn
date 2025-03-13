declare function UserProfile(props: Props): {
    name: string;
    age: number;
    status: string;
    adminControls: boolean;
    activate: () => void;
};
declare function UserProfile(props: any): {
    name: any;
    age: any;
    status: string;
    adminControls: any;
    activate: () => void;
};
declare function updateUser(updatedUser: User): void;
declare function updateUser(updatedUser: any): void;
type User = {
    id: number;
    name: string;
    age: number;
    isActive: boolean;
};
type Props = {
    user: User;
    onUpdate?: ((user: User) => void) | undefined;
};
declare const testUser: User;
declare const profile: {
    name: any;
    age: any;
    status: string;
    adminControls: any;
    activate: () => void;
};
