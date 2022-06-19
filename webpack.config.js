import path from "path";

export default {
    entry: "./src/client/client.js",
    output: {
        filename: "app-bundle.js",
        path: path.resolve("./src/static/js/bundles/"),
    },
    mode: "development"
};

