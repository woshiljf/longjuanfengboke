"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: "static",
        assetsPublicPath: "/",
        proxyTable: {
            "/api": {
                target: "https://netease-cloud-music-api-gamma-three.vercel.app",
                // target: "http://123.207.32.32:9001", // 张某某
                // target: 'http://10.65.1.105:8087',  // 某某某
                // target: 'http://v.juhe.cn/toutiao/index', // 测试端口
                // target: 'http://10.65.6.1:8187', // 开发端口
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    "^/api": ""
                }
            },
            "/pdc": {
                // target: 'http://localhost:8080',
                // target: 'http://10.65.2.40:8087',   // 张某某
                // target: 'http://10.65.1.105:8087',  // 某某某
                target: "http://10.65.6.201:8087", // 测试端口
                // target: 'http://10.65.6.1:8187', // 开发端口
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    "^/pdc": ""
                }
            },
            "/bff": {
                // target: 'http://10.65.6.201:8098', // 测试端口
                target: "http://10.65.6.1:8094", // 开发环境
                // target: 'http://10.65.2.59:8080', // 戴逢
                // target: 'http://10.65.1.26:8088', // 朱家田
                // target: 'http://10.65.2.109:8090',   // 仁浩
                // target: 'http://10.65.6.1:8299', // bff(收发货接口)
                // target: 'http://10.65.2.59:8080', // 戴逢
                // target: 'http://10.65.6.201:8302',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    "^/bff": ""
                }
            }
        },

        // Various Dev Server settings
        host: "localhost", // can be overwritten by process.env.HOST
        port: 8089, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: "cheap-module-eval-source-map",

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, "../dist/index.html"),

        // Paths
        assetsRoot: path.resolve(__dirname, "../dist"),
        assetsSubDirectory: "static",
        assetsPublicPath: "/",

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: "#source-map",

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ["js", "css"],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
};