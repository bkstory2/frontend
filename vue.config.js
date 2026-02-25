const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map', // VS Code 디버깅용
    output: {
      devtoolModuleFilenameTemplate: info => {
        const resPath = info.resourcePath.replace(/\\/g, '/');
        if (resPath.match(/\.vue$/)) {
          return `webpack:///${resPath}`;
        }
        return `webpack:///${resPath.replace(/^\.\//, '')}`;
      }
    }
  },
  devServer: {
    hot: true,
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
