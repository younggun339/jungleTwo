const { overrideDevServer } = require('customize-cra');

const devServerConfig = () => (config) => {
//   config.client = {
//     webSocketURL: {
//       hostname: 'zzrot.store',
//       pathname: '/ws',
//       port: '443',
//       protocol: 'wss',
//     },
//   };
  return config;
};

module.exports = {
  devServer: overrideDevServer(devServerConfig()),
};
