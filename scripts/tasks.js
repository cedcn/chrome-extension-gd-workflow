const shell = require('shelljs')

exports.copyAssets = (type) => {
  const env = type === 'build' ? 'prod' : type
  shell.rm('-rf', type)
  shell.mkdir(type)
  shell.cp(`chrome/manifest.json`, `${type}/manifest.json`)
  shell.cp('-R', 'chrome/assets/*', type)
  shell.exec(`pug -O "{ env: '${env}' }" -o ${type} chrome/views/`)
}
