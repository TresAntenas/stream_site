const path = require("path");

module.exports = {
  entry: "./zoom.js", // Asegúrate de que esta ruta es correcta
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production"
};
