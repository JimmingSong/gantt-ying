let path = require('path');
let env = process.env.NODE_ENV;
console.log(env);
module.exports = {
    entry: env === 'development' ?  './src/main.js' : './src/components/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: './dist',
        filename: 'GanttYing.js',
        library: 'GanttYing',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    configureWebpack: {
      devtool: env === 'development' ? 'source-map' : false
    }
};
