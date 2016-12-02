var path = require('path')

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'Vue',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {test: /\.css/, loader: "style!css"},
            {test: /\.styl$/, loader: "style!css!stylus"},
            {test: /\.js$/, loader: 'babel'},
            {test: /.(png)|(jpg)$/, loader: 'url?limit=50000'}
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js'
        },
        extensions: ['', '.js', '.json', '.vue']
    }
}
