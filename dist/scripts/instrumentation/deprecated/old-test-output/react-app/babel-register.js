"use strict";
// Set up Babel to handle JSX when importing
require('@babel/register')({
    presets: ['@babel/preset-react'],
    extensions: ['.jsx', '.js'],
    cache: false
});
