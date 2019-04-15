'use strict'

module.exports = {
  apps: [
    {
      name: 'Stark',
      script: './bin/www',
      max_memory_restart: '200M',
      env_production: {
        PROC: true
      }
    }
  ],
  deploy: {
    production: {
      key: '~/.ssh/ubuntu_vps',
      user: 'root',
      host: ['159.65.5.25'], // ip
      ref: 'origin/master',
      repo: 'git@github.com:quaj/my-error-logeer.git',
      path: '/root/dcom-v1',
      'post-deploy': 'yarn && pm2 reload deploy.config.js --env production',
      ssh_options: ['StrictHostKeyChecking=no']
    }
  }
}
