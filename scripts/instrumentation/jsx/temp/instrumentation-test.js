
      // Test component with conditional rendering similar to JSX
      function TestComponent(props) {
        // Extract props with defaults
        const {
          condition = false,
          value = 0,
          showDetails = false
        } = props;
        
        // Create a wrapper element (like a React component)
        const wrapper = {
          type: 'div',
          props: { className: 'test-component' },
          children: []
        };
        
        // Conditional rendering similar to how JSX works
        if (condition) {
          // This is like rendering: <h1>Condition is true</h1>
          wrapper.children.push({
            type: 'h1',
            props: {},
            children: ['Condition is true']
          });
        } else {
          // This is like rendering: <h2>Value is: {value}</h2>
          wrapper.children.push({
            type: 'h2',
            props: {},
            children: ['Value is: ' + value]
          });
          
          // Nested conditional (like in JSX)
          if (showDetails && value > 10) {
            // This is like rendering: <p>This is a high value!</p>
            wrapper.children.push({
              type: 'p',
              props: { className: 'highlight' },
              children: ['This is a high value!']
            });
          } else if (showDetails) {
            // This is like rendering: <p>This is a regular value.</p>
            wrapper.children.push({
              type: 'p',
              props: {},
              children: ['This is a regular value.']
            });
          }
        }
        
        return wrapper;
      }
      
      // Test the component
      console.log(TestComponent({ condition: true }));
      console.log(TestComponent({ condition: false, value: 15, showDetails: true }));
      console.log(TestComponent({ condition: false, value: 5, showDetails: false }));
    