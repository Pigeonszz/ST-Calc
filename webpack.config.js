const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'calc.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: {
        extensions: ['.js'],
    },
    target: 'web',
    mode: 'production',
};
