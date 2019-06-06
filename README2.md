# vue 显示 markdown 文件
vue 页面显示 readme.md 文件, 使用 showdown.js 实现

使用 npm install showdown --save 安装后，在 vue 文件中引入，如下效果：

<template>
  <div>about</div>
</template>
<script>
import showdown from 'showdown'
import readme from '../../README.md'
console.log(readme)
export default {
  data () {
    return {}
  },
  components: {
    showdown
  }
}
</script>
<style scoped="true"></style>

但是会报错，如下

[WDS] Errors while compiling. Reload prevented.

./README.md Module parse failed: Unexpected character '#' (1:0) You may need an appropriate loader to handle this file type.

原因是不识别这中格式，markdown 中的 ‘#’ 号，安装 `markdown-loader  html-loader ` `npm i markdown-loader html-loader --save` 

webpack.base.conf.js 中添加 `rules` 规则{ test: /\.md$/, use: [ { loader: 'html-loader' }, { loader: 'markdown-loader', options: {} } ] }

设置完这些后就好用了，这个时候一些转换后的标签没有样式，需要添加对应的样式，这个可以查看一下简书的或者 github 样式，自行添加。

如果代码显示需要语法高亮，需要单独添加 highlight.js 实现。

##### 完整例子：

###### markdown.vue

<template>
  <div class="main">
    <el-row>
      <el-col :md="3" :lg="6" :xl="8" class="hidden-sm-and-down">&nbsp;</el-col>
      <el-col :sm="24" :md="18" :lg="12" :xl="8">
        <div v-html="html" class="center"></div>
      </el-col>
      <el-col :md="3" :lg="6" :xl="8" class="hidden-sm-and-down">&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
import showdown from 'showdown'
import readme from '../../README.md'
export default {
  data () {
    return {
      md: readme,
      html: ''
    }
  },
  components: {
    showdown
  },
  mounted () {
    let converter = new showdown.Converter()
    let text = this.md.toString()
    this.html = converter.makeHtml(text)
  }
}
</script>

<style>
.main {
  padding: 10px 30px;
}
blockquote {
  border-left: #eee solid 5px;
  padding-left: 15px;
  color: #8e8e8e;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
ul li {
  line-height: 25px;
}
pre code {
  background: #F6F6F6;
}
p code {
  color: #D34B62;
  background: #F6F6F6;
  margin: 0 2px;
}

@keyframes squeezeBody {
  from {
    width: 100%;
  }
  to {
    width: calc(100% - 300px);
  }
}

@-webkit-keyframes squeezeBody {
  from {
    width: 100%;
  }
  to {
    width: calc(100% - 300px);
  }
}

@keyframes stretchBody {
  from {
    width: calc(100% - 300px);
  }
  to {
    width: 100%;
  }
}

@-webkit-keyframes stretchBody {
  from {
    width: calc(100% - 300px);
  }
  to {
    width: 100%;
  }
}

.squeezed-body {
  animation: squeezeBody 0.5s ease;
  -webkit-animation: squeezeBody 0.5s ease;
  width: calc(100% - 300px);
}

.full-body {
  animation: stretchBody 0.5s ease;
  -webkit-animation: stretchBody 0.5s ease;
  width: 100%;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Old Standard TT', serif;
  font-weight: bold;
}

h1 {
  border-bottom: 1px solid #ddd;
}

.serif {
  font-family: 'Old Standard TT', serif;
}

.top-bar {
  height: 45px;
  min-height: 45px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

.bars-lnk {
  color: #fff;
}

.bars-lnk i {
  display: inline-block;
  margin-left: 10px;
  margin-top: 7px;
}

.bars-lnk img {
  display: inline-block;
  margin-left: 10px;
  margin-top: -15px;
  margin-right: 15px;
  height: 35px;
}

.lateral-menu {
  background-color: #333;
  color: rgb(144, 144, 144);
  width: 300px;
  font-family: 'Open Sans', 'Myriad Pro', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Geneva, Verdana, sans-serif;
}

.lateral-menu label {
  color: rgb(144, 144, 144);
}

.lateral-menu-content {
  padding-left: 10px;
  height: 100%;
  font-size: 12px;
  font-style: normal;
  font-variant: normal;
  font-weight: bold;
  line-height: 16px;
}

.lateral-menu-content .title {
  padding-top: 15px;
  font-size: 2em;
  height: 45px;
}

.lateral-menu-content-inner {
  overflow-y: auto;
  height: 100%;
  padding-top: 10px;
  padding-bottom: 50px;
  padding-right: 10px;
  font-size: 0.9em;
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  height: 100%;
  padding-top: 65px;
}

.container>* {
  display: block;
  width: 50%;
  margin-left: 10px;
  margin-right: 10px;
  max-height: 100%;
}

.container textarea {
  resize: none;
  font-family: Consolas, "Liberation Mono", Courier, monospace;
  height: 97%;
  max-height: 97%;
  width: 45%;
}

#preview {
  height: 97%;
  max-height: 97%;
  border: 1px solid #eee;
  overflow-y: scroll;
  width: 55%;
  padding: 10px;
}

pre {
  white-space: pre-wrap;
  /* css-3 */
  white-space: -moz-pre-wrap;
  /* Mozilla, since 1999 */
  white-space: -pre-wrap;
  /* Opera 4-6 */
  white-space: -o-pre-wrap;
  /* Opera 7 */
  word-wrap: break-word;
  /* Internet Explorer 5.5+ */
  background-color: #f8f8f8;
  border: 1px solid #dfdfdf;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  padding: 0.125rem 0.3125rem 0.0625rem;
}

pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.modal-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(51, 51, 51, 0.5);
}

.modal-inner {
  margin-top: 200px;
  margin-left: auto;
  margin-right: auto;
  width: 600px;
  height: 225px;
  background-color: #fff;
  opacity: 1;
  z-index: 1000;
}

.modal-close-btn {
  float: right;
  display: inline-block;
  margin-right: 5px;
  color: #ff4336;
}

.modal-close-btn:hover {
  float: right;
  display: inline-block;
  margin-right: 5px;
  color: #8d0002;
}

.modal-topbar {
  clear: both;
  height: 25px;
}

.modal-inner .link-area {
  margin: 10px;
  height: 170px;
}

.modal-inner textarea {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.version {
  color: white;
  font-size: 0.8em !important;
}
</style>

###### webpack.base.conf.js
<script>
  'use strict'
  const path = require('path')
  const utils = require('./utils')
  const config = require('../config')
  const vueLoaderConfig = require('./vue-loader.conf')

  function resolve (dir) {
    return path.join(__dirname, '..', dir)
  }

  const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
      formatter: require('eslint-friendly-formatter'),
      emitWarning: !config.dev.showEslintErrorsInOverlay
    }
  })

  module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
      app: './src/main.js'
    },
    output: {
      path: config.build.assetsRoot,
      filename: '[name].js',
      publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
      }
    },
    module: {
      rules: [
        ...(config.dev.useEslint ? [createLintingRule()] : []),
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader'
            },
            {
              loader: 'markdown-loader',
              options: {}
            }
          ]
        }
      ]
    },
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  }
<script>

  