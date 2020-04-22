const fs = require('fs-plus')
const path = require('path')
const dedent = require('dedent')
const KeymapManager = require('atom-keymap')
const CSON = require('season')

const bundledKeymaps = (require('../package.json')||{})._atomKeymaps

KeymapManager.prototype.onDidLoadBundledKeymaps = (callback) => {
  if (this.emitter) this.emitter.on('did-load-bundled-keymaps', callback)
}

KeymapManager.prototype.onDidLoadUserKeymap = (callback) => {
  this.emitter.on('did-load-user-keymap', callback)
}

KeymapManager.prototype.canLoadBundledKeymapsFromMemory = ()=> {
  return !!bundledKeymaps
}

KeymapManager.prototype.loadBundledKeymaps = ()=> {
  if (!!bundledKeymaps)
    for (const keymapName in bundledKeymaps) {
      const keymap = bundledKeymaps[keymapName];
      keymapPath = `core:${keymapName}`
      this.add(keymapPath, keymap, 0, this.devMode || false)
  } else {
    keymapsPath = path.join(this.resourcePath, 'keymaps')
    this.loadKeymap(keymapsPath)
  }
  this.emitter.emit('did-load-bundled-keymaps')
}

KeymapManager.prototype.getUserKeymapPath = ()=> {
  if (!this.configDirPath) return "" 

  const userKeymapPath = CSON.resolve(path.join(this.configDirPath, 'keymap'))
  if (userKeymapPath)
    return userKeymapPath
  else
    return path.join(this.configDirPath, 'keymap.cson')
}

KeymapManager.prototype.loadUserKeymap = ()=> {
  const userKeymapPath = this.getUserKeymapPath()
  if (!fs.isFileSync(userKeymapPath)) return 

  try {
    this.loadKeymap(userKeymapPath, {watch: true, suppressErrors: true, priority: 100})
  } catch (error) {
    if (error.message.indexOf('Unable to watch path') > -1) {
      message = dedent`
        Unable to watch path: '${path.basename(userKeymapPath)}'. Make sure you
        have permission to read '${userKeymapPath}'.

        On linux there are currently problems with watch sizes. See
        [this document][watches] for more info.
        [watches]:https://github.com/atom/atom/blob/master/docs/build-instructions/linux.md#typeerror-unable-to-watch-path
      `
      this.notificationManager.addError(message, {dismissable: true})
    } else {
      detail = error.path
      stack = error.stack
      this.notificationManager.addFatalError(error.message, detail, stack, {dismissable: true})
    }
  }

  this.emitter.emit('did-load-user-keymap')
}

KeymapManager.prototype.subscribeToFileReadFailure = ()=> {
 this.onDidFailToReadFile((error) => {
    const userKeymapPath = this.getUserKeymapPath()
    const message = `Failed to load '${userKeymapPath}'`

   detail = (error.location) ? error.stack : error.message

   this.notificationManager.addError(message, detail, {dismissable: true})
 })
}

module.exports = KeymapManager
