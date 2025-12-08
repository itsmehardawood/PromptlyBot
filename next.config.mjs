/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack completely
  experimental: {
    turbo: false
  },

  webpack(config, { isServer }) {
    if (!isServer) {
      // Keep your UMD widget config
      config.output.library = "ChatbotWidget";
      config.output.libraryTarget = "umd";
      config.output.filename = "static/js/chatbot-embed.[contenthash].js";
    }

    config.resolve.extensions.push(".mjs");

    return config;
  }
};

export default nextConfig;
