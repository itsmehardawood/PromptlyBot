/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.output.library = 'ChatbotWidget';
      config.output.libraryTarget = 'umd';
      config.output.filename = 'static/js/chatbot-embed.[contenthash].js'; // 👈 fix the conflict
    }

    config.resolve.extensions.push('.mjs');

    return config;
  }
};

export default nextConfig;
