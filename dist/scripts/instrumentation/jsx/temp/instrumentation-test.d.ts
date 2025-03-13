declare function TestComponent(props: any): "Greater than 10" | "Less than or equal to 10" | "Condition is true";
declare function TestComponent(props: any): {
    type: string;
    props: {
        className: string;
    };
    children: never[];
};
