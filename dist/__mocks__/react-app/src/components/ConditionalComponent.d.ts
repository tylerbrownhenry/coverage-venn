export default ConditionalComponent;
/**
 * Component that demonstrates different conditional rendering patterns
 * Used to test instrumentation of conditional JSX rendering
 */
declare function ConditionalComponent({ condition }: {
    condition: any;
}): React.JSX.Element;
import React from 'react';
