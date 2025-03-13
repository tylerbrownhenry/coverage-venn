"use strict";
// @flow
// Comprehensive Flow example with advanced features
// Primitive types
const count = 42;
const name = 'Flow Test';
const isEnabled = true;
const nothing = null;
const missing = undefined;
const textAlign = 'center';
// Maybe types
function getMiddleName(fullName) {
    const parts = fullName.split(' ');
    return parts.length > 2 ? parts[1] : null;
}
string,
    name;
string,
    age;
number,
    metadata;
{
     | createdAt;
    Date, lastLogin;
    Date | ;
}
    | ;
;
// Array and tuple types
const numbers = [1, 2, 3, 4, 5];
const userInfo = ['john', 30, true];
// Generic types
class Container {
    constructor(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
}
// Type casting with Flow
const userId = ((document.getElementById('user-id'))), any, HTMLInputElement;
string, b;
number | ;
 > ;
string,
    items;
Array < string > ,
    onSelect ?  : (item) => void 
        | ;
;
function ItemList(props) {
    const { title, items, onSelect } = props;
    function handleClick(item) {
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
function processUser(user) {
    const ageGroup = user.age < 18 ? 'minor' : 'adult';
    const createdDate = user.metadata.createdAt.toISOString().split('T')[0];
    return `${user.name} (${ageGroup}) - Created: ${createdDate}`;
}
const testUser = {
    id: 'user123',
    name: 'Alice Johnson',
    age: 28,
    metadata: {
        createdAt: new Date('2023-01-15'),
        lastLogin: new Date()
    }
};
const numberContainer = new Container < number > (42);
console.log('User details:', processUser(testUser));
console.log('Container value:', numberContainer.getValue());
console.log('Middle name:', getMiddleName('John Smith Doe'));
