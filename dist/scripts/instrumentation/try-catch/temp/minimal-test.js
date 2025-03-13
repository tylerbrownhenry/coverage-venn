"use strict";
function simple() {
    try {
        return "success";
    }
    catch (error) {
        return "error";
    }
}
console.log(simple());
