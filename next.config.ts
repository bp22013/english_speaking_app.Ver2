import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    poweredByHeader: false,
    experimental: {
        serverActions: {},
    },
};

export default nextConfig;
