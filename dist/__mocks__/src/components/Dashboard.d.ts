import React from 'react';
import { DataItem } from '../utils/dataUtils';
interface DashboardProps {
    title?: string;
    initialData?: DataItem[];
    showForm?: boolean;
    darkMode?: boolean;
    loading?: boolean;
    error?: string;
}
export declare const Dashboard: React.FC<DashboardProps>;
export {};
