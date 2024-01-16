/** @type {import('next').NextConfig} */

const {PHASE_DEVELOPMENT_SERVER} = require("next/constants");

const API_URL = process.env.DEV_API_URL;

const nextConfig = {
    reactStrictMode: false,
}

module.exports = module.exports = (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return nextConfig;
    }
    return {
        ...nextConfig,
        output: "export",
        distDir: "dist",
        compiler: {
            removeConsole: {
                exclude: ["error"],
            },
        },
    };
};
