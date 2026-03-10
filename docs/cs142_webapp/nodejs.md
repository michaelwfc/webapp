# Reference:
- [NodeJS](https://nodejs.org/en/)
- [An intro to Webpack: what it is and how to use it](https://www.freecodecamp.org/news/an-intro-to-webpack-what-it-is-and-how-to-use-it-8304ecdc3c60/)
- [mobx-react之Provider和inject的原理与实现](https://juejin.cn/post/6913531148329025549)



# Node.js Introduction

## Node.js dependency
- ReactJS is a UI library
- axios
- Webpack is a static module bundler
- HTMLWebpackPlugin to generate an HTML file to be used for serving bundled JavaScript file/files
- express

## node command

mkdir rebot
<!-- create a starter package and add a package.json file -->
npm init

<!-- ReactJS is a UI library which is very helpful in building intelligent complex UIs -->
npm i react@16 react-dom@16 --save

<!-- 要用npm（或任何其他包管理器）安装Adios, will create package.json -->
npm install axios@0
<!-- Webpack is a static module bundler. -->
npm i webpack@3 webpack-dev-server@2 webpack-merge@4 html-webpack-plugin@3 extract-text-webpack-plugin@3 html-webpack-plugin@3 copy-webpack-plugin@4 --save


npm i babel-core@6 babel-loader@7 @babel/preset-react @babel/preset-env --save
npm i babel-polyfill@6

npm i babel-core babel-core babel-loader babel-plugin-import babel-plugin-mobx-deep-action babel-plugin-transform-decorators-legacy babel-plugin-transform-regenerator babel-polyfill babel-preset-env babel-preset-react babel-preset-stage-2 --save--dev

<!-- install dependencis from package.json -->
npm install --legacy-peer-deps

npm install react react-dom axios webpack webpack-dev-server --save
echarts ant antd emoji-js gh-pages mobx mobx-react prop-types socket.io-client d3 dagre dagre-d3 graphlib --save


## nodejs 启动
<!-- 在项目目录下输入启动命令： -->
<!-- Run your entry point file directly -->
node src/app.js

<!-- node start: -->
1. 在 package.json 文件夹中的 scripts 节点下添加启动配置
"scripts":{
"start":"node src/app.js"
}
1. npm start
node run dev

# npm
npm install installs dependencies into the node_modules/ directory, for the node project you're working on.

## npm setting
https://registry.npmjs.org/
```bash
npm config set registry https://registry.npm.taobao.org
npm i webpack@4 安装不同版本的包
npm search webpack-cli
npm install– 根据 package.json 中的 dependencies 在当前目录安装包
npm install 包名– 在当前目录安装包
npm install 包名 –g– 全局模式安装包
npm install 文件路径– 从本地安装
npm install 包名 –registry=地址– 从镜像源安装
npm remove 包名 – 删除一个模块
npm i @webpack-cli/configtest
npm ls
```


## npm run build
命令会执行一系列的构建步骤，如编译代码，压缩文件，混淆代码等，以便将项目打包成生产环境下可用的代码。
具体来说，npm run build 命令会执行 package.json 文件中 "scripts" 对象中 "build" 字段所对应的命令。
例如，如果 "build" 字段设置为 "webpack --config webpack.config.js"，那么执行 "npm run build" 命令就相当于在命令行中运行 "webpack --config webpack.config.js"。


## issuse:
- Error message "error:0308010C:digital envelope routines::unsupported"
export NODE_OPTIONS=--openssl-legacy-provider

set NODE_OPTIONS=--openssl-legacy-provider

- Module build failed: SyntaxError: D:/Projects/elsa_robot/robot/src/index.js: Unexpected token (14:17)
build .babelrc
{
"presets": ["env", "react"]
}