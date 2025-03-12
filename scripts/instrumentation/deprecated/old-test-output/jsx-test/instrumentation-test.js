
        // This file will be instrumented by our plugin
        
        function TestComponent(props) {
          // If statement
          if (props.condition) {
            return "Condition is true";
          }
          
          // Ternary expression
          const result = props.value > 10 ? "Greater than 10" : "Less than or equal to 10";
          
          // Logical expression
          const showExtra = props.showDetails && "Extra details";
          
          return result;
        }
        
        // Test the component
        console.log(TestComponent({ condition: true }));
        console.log(TestComponent({ condition: false, value: 15, showDetails: true }));
        console.log(TestComponent({ condition: false, value: 5, showDetails: false }));
      