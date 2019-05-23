const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const options = {
    "debug": 'debug'
};

require("babel-polyfill");

const makeLibConf = (from) => {
    console.log(`from ${from}`);
    const conf = [];

    conf.push({
        from,
        "to": '../src/lib',
        "toType": 'dir',
        "flatten": true
    });
    conf.push({
        from,
        "to": 'lib',
        "toType": 'dir',
        "flatten": true
    });
    return conf;
};

const libs = [
    'node_modules/showdown/dist/*.min.*',
    'node_modules/prismjs/prism.js',
    'node_modules/prismjs/themes/prism.css',
    'node_modules/prism-themes/themes/prism-xonokai.css',
    'node_modules/es6-tree/public/eztree.js',
    'node_modules/es6-tree/public/eztree.css',
    'node_modules/es6-tree/public/icons/*.*'
];
let libConf = [];

for (let i = 0; i < libs.length; i++) {
    const l = libs[i];

    const c = makeLibConf(l);

    libConf = libConf.concat(c);
}
const cssDir = "./style";
const srcConf = [];

srcConf.push({
    "from": './src/style/vars.css',
    "to": cssDir,
    "toType": 'dir'
});
srcConf.push({
    "from": './src/style/layout.css',
    "to": cssDir,
    "toType": 'dir'
});
srcConf.push({
    "from": './src/style/header.css',
    "to": cssDir,
    "toType": 'dir'
});
srcConf.push({
    "from": './src/style/nav.css',
    "to": cssDir,
    "toType": 'dir'
});
srcConf.push({
    "from": './src/components/blog/blog.css',
    "to": './components/blog',
    "toType": 'dir'
});
srcConf.push({
    "from": './src/components/toc/toc.css',
    "to": './components/toc',
    "toType": 'dir'
});
srcConf.push({
    "from": './src/favicon.ico',
    "to": '.',
    "toType": 'dir'
});
srcConf.push({
    "from": './src/manifest.json',
    "to": '.',
    "toType": 'dir'
});
srcConf.push({
    "from": './articles/*.*',
    "to": '../src/articles',
    "toType": 'dir',
    "flatten": true
});
srcConf.push({
    "from": './articles/*.*',
    "to": './articles',
    "toType": 'dir',
    "flatten": true
});

const totalCopyConf = srcConf.concat(libConf);

totalCopyConf.forEach((conf) => {
    console.log(conf);
});
module.exports = {
    "entry": ["babel-polyfill", './src/index.js'],
    "output": {
        "path": `${__dirname}/dist`,
        "filename": 'bundle.js',
        "publicPath": '/'
    },
    "devServer": {
        "port": 3000,
        "historyApiFallback": {
            "index": 'index.html'
        }
    },
    "module": {
        "rules": [
            {
                "test": /\.js$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader"
                }
            },
            {
                "test": /\.html$/,
                "use": [{
                    "loader": "html-loader"
                }]
            }
        ]
    },
    "plugins": [
        new HtmlWebPackPlugin({
            "template": "./src/index.html",
            "filename": "./index.html"
        }),
        new CopyWebpackPlugin(totalCopyConf, options)
    ]
};