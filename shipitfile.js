module.exports = function (shipit) {
  require('shipit-deploy')(shipit)
  const name = 'freeway-analyzer'
  shipit.initConfig({
    // branch: 'supplier-login',
    default: {
      workspace: '/tmp/github-monitor',
      deployTo: '/app/' + name,
      repositoryUrl: 'https://github.com/ttsa/freeway-analyzer.js',
    },
    production: {
      servers: 'zack@YEE'
    }
  })

  shipit.task('updateAssets', async () => {
    await shipit.local(`npm run build`)
    // console.log(shipit.config.deployTo)
    await shipit.copyToRemote(
      './dist',
      shipit.config.deployTo + '/current',
    )
  })

  shipit.on('deployed', async function () {
    // var shared_path = `${shipit.config.deployTo}/shared`
    try {
      await shipit.local(`npm run build`)
      await shipit.remote(`cd ${shipit.currentPath} && nvm use && npm install`)
      await shipit.copyToRemote(
        './dist',
        shipit.deployTo,
      )
    } catch (error) {
      console.log(error)
    }

    shipit.start('startApp')
  })

  shipit.task('startApp', async () => {
    const current_path = `${shipit.config.deployTo}/current`
    try {
      await shipit.remote(`cd ${current_path} && nvm use && PORT=4000 npm run express:run`)
      // await shipit.remote(`pm2 start ${current_path}/srv/index.js --name ${name}`)
    } catch (error) {
      // await shipit.remote(`pm2 restart ${name}`)
    }

  })
}