module.exports = {
  apps: [
    {
      name: 'MarketsAdmin', // 应用名称
      script: 'npm',
      args: 'run start',
      env: {
        // 默认环境配置
        NODE_ENV: 'development',
        PORT: 7777,
      },
    },
  ],
};
