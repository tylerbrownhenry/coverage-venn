
// @flow
// Comprehensive Flow example with advanced features

// Primitive types
const count: number = 42;
const name: string = 'Flow Test';
const isEnabled: boolean = true;
const nothing: null = null;
const missing: void = undefined;

// Literal types
type Alignment = 'left' | 'center' | 'right';
const textAlign: Alignment = 'center';

// Maybe types
function getMiddleName(fullName: string): ?string {
  const parts = fullName.split(' ');
  return parts.length > 2 ? parts[1] : null;
}

// Object types with exact syntax
type ExactUser = {|
  id: string,
  name: string,
  age: number,
  metadata: {| createdAt: Date, lastLogin: ?Date |}
|};

// Array and tuple types
const numbers: Array<number> = [1, 2, 3, 4, 5];
const userInfo: [string, number, boolean] = ['john', 30, true];

// Function types
type CallbackFn = (error: ?Error, result: ?Object) => void;
type DataProcessor = (data: string) => Promise<Object>;

// Generic types
class Container<T> {
  value: T;
  
  constructor(value: T) {
    this.value = value;
  }
  
  getValue(): T {
    return this.value;
  }
}

// Union and intersection types
type Id = string | number;
type Named = { name: string };
type Timestamped = { createdAt: Date };
type NamedAndTimestamped = Named & Timestamped;

// Type casting with Flow
const userId = ((document.getElementById('user-id'): any): HTMLInputElement);

// Utility types
type Keys = $Keys<ExactUser>;
type Values = $Values<{| a: string, b: number |}>;
type Optional = $Shape<ExactUser>;

// React component with Flow (simplified)
type Props = {|
  title: string,
  items: Array<string>,
  onSelect?: (item: string) => void
|};

function ItemList(props: Props) {
  const { title, items, onSelect } = props;
  
  function handleClick(item: string) {
    if (onSelect) {
      onSelect(item);
    }
  }
  
  return {
    type: 'div',
    props: { className: 'item-list' },
    children: [
      { type: 'h2', props: {}, children: [title] },
      { 
        type: 'ul', 
        props: {}, 
        children: items.map(item => ({
          type: 'li',
          props: { onClick: () => handleClick(item) },
          children: [item]
        }))
      }
    ]
  };
}

// Test functions and data
function processUser(user: ExactUser): string {
  const ageGroup = user.age < 18 ? 'minor' : 'adult';
  const createdDate = user.metadata.createdAt.toISOString().split('T')[0];
  return `${user.name} (${ageGroup}) - Created: ${createdDate}`;
}

const testUser: ExactUser = {
  id: 'user123',
  name: 'Alice Johnson',
  age: 28,
  metadata: {
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date()
  }
};

const numberContainer = new Container<number>(42);

console.log('User details:', processUser(testUser));
console.log('Container value:', numberContainer.getValue());
console.log('Middle name:', getMiddleName('John Smith Doe'));
