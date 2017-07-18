'use strict';

var path = require('path')
var glob = require('glob')
var HtmlWebpackPlugin = require('html-webpack-plugin');

 var utils= {
    /**
     * 获取入口表
     * @param globPath
     * @returns {{}}
     */
    getEntry:function (globPath, options) {
        options = options || {};
        var entries = {},
            basename, tmp, pathname;

        glob.sync(globPath, options).forEach(function (entry) {
            pathname = entry.replace(/\.js$/,'');
            let fpath = entry;
            if(options.cwd){
                fpath = path.join(options.cwd, entry);
            }
            entries[pathname] = fpath;
        });
        return entries;
    },
    /**
     * 需要打包的html自动添加js和css
     */
     getHtmlWebpackPlugin:function(options ){
        options = options || {};
        var htmlfile = glob.sync('**/*.{html,xhtml}',options),conf={},config = [];
        htmlfile.forEach(function(item,index,arr){
          var extname = path.extname(item);
          var basename = path.basename(item,extname);
          var publicpath = item.replace(/\.x?html$/,'');
          var conf = {
            filename:item,
            template:options.cwd+'/'+item,
            chunks:[publicpath],
            inject: 'body'
          }
          config.push(new HtmlWebpackPlugin(conf))
        })
        return config;
     },
    /**
     * 自动添加js和css的自定义设置
     */
    insertStaticPlugin:function(options) {
    }
};

utils.insertStaticPlugin.prototype.apply = function(compiler) {
  var extendReg = /<\/c:extends>/;
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
        var html = htmlPluginData.html
        if(extendReg.test(html)){
            var js = '',css='',src=null;
            var chunks = htmlPluginData.assets.chunks
            for(let chunkName in chunks){
                src= chunks[chunkName]
                js += '<script src="'+src.entry+'"></script>';
                src.css.forEach(function(item,index,arr){
                    css+='<link href="'+item+'" rel="stylesheet">'
                })
            }          
            var mark = '<c:block name="view-style">'+css+'</c:block>'+'<c:block name="view-script">'+js+'</c:block></c:extends>';   
             htmlPluginData.html = html.replace(extendReg,mark)
        }
      callback(null, htmlPluginData);
    });
  });  
};

module.exports  =  utils;