import React from 'react';
interface FormProps {
    initialValues?: {
        name?: string;
        email?: string;
        message?: string;
    };
    onSubmit?: (values: FormValues) => void;
    theme?: 'light' | 'dark';
    showNameField?: boolean;
    disabled?: boolean;
}
interface FormValues {
    name: string;
    email: string;
    message: string;
}
export declare const Form: React.FC<FormProps>;
export {};
