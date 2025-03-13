export default DynamicComponent;
/**
 * Component that demonstrates dynamically generated JSX elements
 * Used to test instrumentation of dynamic content
 */
declare function DynamicComponent({ count }: {
    count?: number | undefined;
}): React.JSX.Element;
import React from 'react';
