// postcss.config.js
// 用 vite 创建项目，配置postcss 需要使用post.config.js 之前使用的 .postcssrc.js 已经被抛弃
module.exports = {
    "plugins": [
        require("postcss-pxtorem")({
            rootValue: 37.5,
            propList: ['*'],
            selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
        })
    ]
}