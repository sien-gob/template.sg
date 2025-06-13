module.exports = {
  apps: [
    {
      name: 'api-template.sg',
      script: './main.js',
      watch: false,
      max_memory_restart: '2G',
      exec_mode: 'cluster',
      instances: 1,
      cron_restart: '0 0 * * *',
      env: {
        NODE_ENV: 'dev',
      },
      env_production: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
