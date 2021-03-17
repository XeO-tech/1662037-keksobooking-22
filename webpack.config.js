const path = require('path');

module.exports = {
  entry: './source/js/main.js',
  devtool: 'source-map',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'build/js'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: "file-loader",
        options: {
          outputPath: '../img/leaflet',
        },
      },
    ],
  },
  resolve: {
    alias: {
        "./images/layers.png$": path.resolve(
            __dirname,
            "./node_modules/leaflet/dist/images/layers.png"
        ),
        "./images/layers-2x.png$": path.resolve(
            __dirname,
            "./node_modules/leaflet/dist/images/layers-2x.png"
        ),
        "./images/marker-icon.png$": path.resolve(
            __dirname,
            "./node_modules/leaflet/dist/images/marker-icon.png"
        )
    }
},
};
