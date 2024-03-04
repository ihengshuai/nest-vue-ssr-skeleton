module.exports = {
  apps: [
    {
      name: "nest-vue3-ssr-skeleton",
      script: "dist/main.js",
      exec_mode: "cluster",
      max_memory_restart: "4G",
      instances: 1,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
