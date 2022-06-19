import path from "path";

export default {
    entry: "./src/static/js/client.js",
    output: {
        filename: "app-bundle.js",
        path: path.resolve("./src/static/js/bundles/"),
    },
    mode: "development"
};

