import path from "path";

export default {
    entry: './static/js/client.js',
    output: {
        filename: 'app-bundle.js',
        path: path.resolve('./static/js/bundles/'),
    },
    mode: 'development'
};

