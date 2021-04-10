"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const vueLoaderConfig = require("./vue-loader.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HappyPack = require('happypack')
const os = require("os");
//充分发挥多核的作用，进程数量设置为设备的核数
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = {
    context: path.resolve(__dirname, "../"),
    entry: {
        app: "./src/main.js"
    },
    output: {
        path: config.build.assetsRoot,
        filename: "[name].js",
        publicPath: process.env.NODE_ENV === "production" ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": resolve("src"),
            api: resolve("src/api"),
            config: resolve("src/config"),
            common: resolve("src/components/common")
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: "vue-loader",
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                // loader: "babel-loader",
                use: ["happypack/loader?id=babel"],
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/webpack-dev-server/client")
                ],
                // options: {
                //     cacheDirectory: true
                // },
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("img/[name].[hash:7].[ext]")
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("media/[name].[hash:7].[ext]")
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
                }
            },
            // 配置图片压缩
            // {
            //     loader: 'image-webpack-loader',
            //     options: {
            //         bypassOnDebug: true,
            //     }
            // },
            {
                test: /\.md$/,
                loader: 'vue-markdown-loader',
                options: {
                    preprocess: function(MarkdownIt, Source) {
                        MarkdownIt.renderer.rules.table_open = function() {
                            return '<div class="table-container"><table class="table">';
                        };
                        MarkdownIt.renderer.rules.table_close = function() {
                            return '</table></div>';
                        };
                        return Source;
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
            favicon: "favicon.ico",
            inject: true
        }),
        // 使用happypack，加快打包速度
        new HappyPack({
            id: 'babel',
            loaders: [{
                loader: "babel-loader",
                options: {
                    cacheDirectory: true
                },
            }],
            threadPool: happyThreadPool
        }),
        new HappyPack({
            id: 'css',
            loaders: ['css-loader']
        })
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    },
    watch: true
};