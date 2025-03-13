export default PropsComponent;
/**
 * Component that demonstrates various prop patterns
 * Used to test instrumentation of JSX with props
 */
declare function PropsComponent({ title, description, items, showHeader, onAction, theme }: {
    title?: string | undefined;
    description: any;
    items?: never[] | undefined;
    showHeader?: boolean | undefined;
    onAction?: (() => void) | undefined;
    theme?: string | undefined;
}): React.JSX.Element;
import React from 'react';
