'use strict';
const path = require('path');
const webpack = require('webpack');
const glob = require("glob");
const utils = require('./build/utils');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

//html文件自动添加js
const HtmlWebpackPlugin = require('html-webpack-plugin');
//自动清空dist目录
const CleanWebpackPlugin = require('clean-webpack-plugin');
//文件资源表产出
const ManifestPlugin = require('webpack-manifest-plugin');
//项目根路径
const ROOT_PATH = path.resolve(process.cwd());
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
const NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');

const svgDirs = [
    require.resolve('antd').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
    // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
];

let entryFile = utils.getEntry('**/index.js', {cwd: APP_PATH});
entryFile['common/frame'] = ['react', 'react-dom'];
//
console.log(entryFile);
module.exports = function (env) {
    console.log(env)
    env = env || {};
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字

    var config = {
        devtool: "cheap-module-source-map",
        entry: entryFile,
        //输出的文.件名 合并以后的js会命名为bundle.js
        output: {
            path: BUILD_PATH,
            //publicPath: '/view',
            filename: '[name]-[hash:6].js'
        }
        ,
        externals: {
            // 'echarts': 'window.echarts'
        }
        ,
        module: {
            rules: [
                /* {
                 test: /\.(css|less)$/,
                 use: {
                 loader: ExtractTextPlugin.extract({
                 fallback: 'style-loader',
                 use: 'css-loader!postcss-loader!less-loader?{"sourceMap":true}'
                 //use: 'css-loader!postcss-loader!' + `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`
                 })
                 }
                 },*/
                {
                    test: /\.(css|less)$/,
                    include: [APP_PATH, path.join(NODE_MODULES_PATH, 'antd')],
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                path: null,
                            }
                        },
                        'less-loader',
                    ]
                },

                {
                    test: /\.js/,
                    include: [APP_PATH, path.join(NODE_MODULES_PATH, 'antd')],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'env'],
                            "plugins": [["import", {"style": 'css', "libraryName": "antd"}]]

                        },
                    }
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader'
                    }

                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use: {
                        loader: 'url-loader',
                        options:{
                            limit: 8192,
                            name:'[name]-[hash:8].[ext]',
                            outputPath:'img/'
                        }
                    }

                },
                {
                    test: /\.(svg)$/i,
                    include: path.join(NODE_MODULES_PATH, 'antd'),
                    use: {
                        loader: 'svg-sprite-loader',
                    }
                }
            ]
        }
        ,
        resolve: {
            modules: ['node_modules', NODE_MODULES_PATH, APP_PATH],
            extensions: ['.web.js', '.js', '.json'],
        }
        ,
        plugins: [
            //先清除原来的dis目录
            new CleanWebpackPlugin([path.join(ROOT_PATH, 'dist')]),
            //静态资源表
            new ManifestPlugin(),
            //html中插入对应index.js
            new HtmlWebpackPlugin({
                filename:'index11.html',
                template:path.join(APP_PATH, 'index11.html'),
               // chunks:[publicpath],
                inject: 'body',
                //这里要匹配entry file
                chunks:['common/frame', 'index']
                /*files:{
                    js:['index.js']
                }
*/
            }),
            new webpack.optimize.CommonsChunkPlugin('common/frame'),
            new ExtractTextPlugin("[name].css"),
            // new utils.insertStaticPlugin({options: ''}),
            new webpack.LoaderOptionsPlugin({
                options: {
                    postcss: [
                        require('autoprefixer')()
                    ]
                }
            }),
            //去掉 react的警告报错，插件把全部判断环境的地方都修改为false， 之后经过UglifyJs会自动优化去掉if(false){}
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': env.production ? '"production"' : '"test"'
                }
            })

        ].concat(/*utils.getHtmlWebpackPlugin({cwd: APP_PATH})*/)
    };
    //生产环境去掉sourceMap
    if (env.production) {
        config.devtool = false;
    }
    return config;
};
