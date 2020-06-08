const shell = require('shelljs')
const tasks = require('./tasks')

console.log('[Copy assets]')
console.log('-'.repeat(80))
tasks.copyAssets('dev')

console.log('[Webpack Dev]')
console.log('-'.repeat(80))

shell.exec('webpack --config webpack/dev.config.js --progress --profile --colors --watch')
