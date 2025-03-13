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
declare namespace testUser {
    let id: number;
    let name: string;
    let age: number;
    let isActive: boolean;
}
declare namespace profile {
    export { displayName as name };
    let age_1: any;
    export { age_1 as age };
    export { userStatus as status };
    export { showAdminControls as adminControls };
    export { handleActivation as activate };
}
declare const displayName: any;
declare const userStatus: "Active User" | "Inactive User";
declare const showAdminControls: any;
declare function handleActivation(): void;
