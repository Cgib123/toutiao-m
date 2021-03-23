module.exports = {
  // 配置要使用的postCSS插件
  plugins: {
    // 配置使用autoprefixer插件
    // 作用：生成浏览器css样式规则前缀
    // autoprefixer: {
    //   // autoprefixer插件的配置
    //   // 配置要兼容的环境信息
    //   // vuecli 内部已经配置了，再次配置会产生冲突
    //   browsers: ['Android >= 4.0', 'iOS >= 8'],
    // },
    // 配置使用postcss-pxtorem插件
    'postcss-pxtorem': {
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*']
    }
  }
}