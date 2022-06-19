import dotenv from "dotenv";

dotenv.config();

export default {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    isTls: false,
    sslKey: "path/to/key",
    sslCrt: "path/to/cert"
};
