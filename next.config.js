/** @type {import("next").NextConfig} */

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const nextConfig = {
    reactStrictMode: false,
    basePath: process.env.BASE_PATH ?? '',
    assetPrefix: process.env.BASE_PATH ?? '',
    env: {
        BASE_PATH: process.env.BASE_PATH ?? '',
        BEI_AN_MODE: process.env.BEI_AN_MODE?.toUpperCase() === 'TRUE' ? 'TRUE' : 'FALSE',
    },
};

module.exports = module.exports = (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return nextConfig;
    }
    return {
        ...nextConfig,
        output: 'export',
        distDir: 'dist',
        compiler: {
            removeConsole: {
                exclude: ['error'],
            },
        },
    };
};
