module.exports = {
  entry: {
    gettingStarted: "./gettingStarted.jsx",
    p2: "./p2.jsx",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[contenthash].[ext]", // keeps the hashed filename
              outputPath: ".", // puts the file in compiled/
              publicPath: "/compiled/", // the URL prefix in the browser
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: `${__dirname}/compiled`,
    publicPath: "/",
    filename: "[name].bundle.js",
  },
  mode: "development",
};
