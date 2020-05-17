let webpack = require('webpack');
let env = process.env.NODE_ENV;
module.exports = {
    pages: {
        index: {
            entry: env === 'development'? './example/main.js' : './ganttYing/index.js',
            template: './public/index.html',
            filename: 'index.html'
        }
    },
    productionSourceMap: false,
    configureWebpack: config => {
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    }
};
