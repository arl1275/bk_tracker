"use strict";
const path = require('path');
const { NODE_ENV = 'production', } = process.env;
module.exports = {
    mode: NODE_ENV,
    entry: './src/index.ts',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /src/,
                use: [
                    'ts-loader',
                ],
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }
};
//# sourceMappingURL=webpack.config.js.map