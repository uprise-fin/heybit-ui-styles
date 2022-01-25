const webpack = require("webpack");

const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = () => {
  const env = {
    MODE: "development",
  };
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return merge(common, {
    mode: env.MODE,
    devtool: "source-map",
    devServer: {
      watchFiles: ["src/**/*"],
    },
    plugins: [
      ...common.plugins,
      new webpack.DefinePlugin(envKeys),
      new HtmlWebpackPlugin({
        // index.html 템플릿을 기반으로 빌드 결과물을 추가해줌
        template: "demo/index.html",
      }),
    ],
  });
};
