export declare class MigrationManager {
    planMigration(): Promise<void>;
    executeMigration(): Promise<void>;
    validateMigration(): Promise<void>;
}
