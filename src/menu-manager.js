const path = require('path')

const _ = require('underscore-plus')
const {ipcRenderer} = require('electron')
const CSON = require('season')
const fs = require('fs-plus')
const {Disposable} = require('event-kit')

const MenuHelpers = require('./menu-helpers')

const platformMenu = ((require('../package.json')||{})._atomMenu||{}).menu

// Extended: Provides a registry for menu items that you'd like to appear in the
// application menu.
//
// An instance of this class is always available as the `atom.menu` global.
//
// ## Menu CSON Format
//
// Here is an example from the [tree-view](https://github.com/atom/tree-view/blob/master/menus/tree-view.cson):
//
// ```coffee
// [
//   {
//     'label': 'View'
//     'submenu': [
//       { 'label': 'Toggle Tree View', 'command': 'tree-view:toggle' }
//     ]
//   }
//   {
//     'label': 'Packages'
//     'submenu': [
//       'label': 'Tree View'
//       'submenu': [
//         { 'label': 'Focus', 'command': 'tree-view:toggle-focus' }
//         { 'label': 'Toggle', 'command': 'tree-view:toggle' }
//         { 'label': 'Reveal Active File', 'command': 'tree-view:reveal-active-file' }
//         { 'label': 'Toggle Tree Side', 'command': 'tree-view:toggle-side' }
//       ]
//     ]
//   }
// ]
// ```
//
// Use in your package's menu `.cson` file requires that you place your menu
// structure under a `menu` key.
//
// ```coffee
// 'menu': [
//   {
//     'label': 'View'
//     'submenu': [
//       { 'label': 'Toggle Tree View', 'command': 'tree-view:toggle' }
//     ]
//   }
// ]
// ```
//
// See {::add} for more info about adding menu's directly.
module.exports = class MenuManager {
  constructor({resourcePath, keymapManager, packageManager}) {
    this.resourcePath = resourcePath;
    this.keymapManager = keymapManager;
    this.packageManager = packageManager;
    this.initialized = false
    this.pendingUpdateOperation = null
    this.template = []
    this.keymapManager.onDidLoadBundledKeymaps( ()=> this.loadPlatformItems())
    this.packageManager.onDidActivateInitialPackages( ()=> this.sortPackagesMenu())
  }
  
  initialize({resourcePath}) {
    this.resourcePath =resourcePath;
    this.keymapManager.onDidReloadKeymap( ()=> this.update())
    this.update()
    this.initialized = true
  }
  
  // Public: Adds the given items to the application menu.
  //
  // ## Examples
  // ```coffee
  //   atom.menu.add [
  //     {
  //       label: 'Hello'
  //       submenu : [{label: 'World!', command: 'hello:world'}]
  //     }
  //   ]
  // ```
  //
  // * `items` An {Array} of menu item {Object}s containing the keys:
  //   * `label` The {String} menu label.
  //   * `submenu` An optional {Array} of sub menu items.
  //   * `command` An optional {String} command to trigger when the item is
  //     clicked.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to remove the
  // added menu items.
  add(items) {
    items = _.deepClone(items)
  
    for (var item of items) {
      if (!item.label) // TODO: Should we emit a warning here?
        continue
      this.merge(this.template, item)
    }
  
    this.update()
    new Disposable( ()=> this.remove(items))
  }
  
  remove(items) {
    for (item of items)
      this.unmerge(this.template, item)
    this.update()
  }
  
  clear() {
    this.template = []
    this.update()
  }
  
  // Should the binding for the given selector be included in the menu
  // commands.
  //
  // * `selector` A {String} selector to check.
  //
  // Returns a {Boolean}, true to include the selector, false otherwise.
  includeSelector(selector) {
    try {
      if (document.body.webkitMatchesSelector(selector))
        return true
    } catch (error) {
      // Selector isn't valid
      return false
    }
  
    // Simulate an atom-text-editor element attached to a atom-workspace element attached
    // to a body element that has the same classes as the current body element.
    if (!this.testEditor) {
      // Use new document so that custom elements don't actually get created
      testDocument = document.implementation.createDocument(document.namespaceURI, 'html')
    
      testBody = testDocument.createElement('body')
      testBody.classList.add(...this.classesForElement(document.body))
    
      testWorkspace = testDocument.createElement('atom-workspace')
      workspaceClasses = this.classesForElement(document.body.querySelector('atom-workspace'))
      if (workspaceClasses.length == 0)
        workspaceClasses = ['workspace']
      testWorkspace.classList.add(...workspaceClasses)
      
      testBody.appendChild(testWorkspace)
      
      this.testEditor = testDocument.createElement('atom-text-editor')
      this.testEditor.classList.add('editor')
      testWorkspace.appendChild(this.testEditor)
    }
    
    element = this.testEditor
    while (element) {
      if (element.webkitMatchesSelector(selector))
        return true
      element = element.parentElement
    }
    
    return false
  }
  
  // Public: Refreshes the currently visible menu.
  update() {
    if (!this.initialized) return
  
    if (this.pendingUpdateOperation)
      clearTimeout(this.pendingUpdateOperation)
  
    this.pendingUpdateOperation = setTimeout( ()=> {
      unsetKeystrokes = new Set()
      for (binding of this.keymapManager.getKeyBindings())
        if (binding.command == 'unset!')
          unsetKeystrokes.add(binding.keystrokes)
    
      keystrokesByCommand = {}
      for (binding of this.keymapManager.getKeyBindings()) {
        if (!this.includeSelector(binding.selector)) continue
        if (unsetKeystrokes.has(binding.keystrokes)) continue
        if (process.platform == 'darwin' && /^alt-(shift-)?.$/.test(binding.keystrokes))  continue
        if (process.platform == 'win32' && /^ctrl-alt-(shift-)?.$/.test(binding.keystrokes))  continue
        if (!keystrokesByCommand[binding.command]) keystrokesByCommand[binding.command] = []
        keystrokesByCommand[binding.command].unshift(binding.keystrokes)
      }

      this.sendToBrowserProcess(this.template, keystrokesByCommand)
    }
    , 1)
  }
  
  loadPlatformItems() {
    if (platformMenu)
      this.add(platformMenu)
    else {
      const menusDirPath = path.join(this.resourcePath, 'menus')
      platformMenuPath = fs.resolve(menusDirPath, process.platform, ['cson', 'json'])
      const {menu} = CSON.readFileSync(platformMenuPath)
      this.add(menu)
    }
  }
  
  // Merges an item in a submenu aware way such that new items are always
  // appended to the bottom of existing menus where possible.
  merge(menu, item) {
    MenuHelpers.merge(menu, item)
  }
  
  unmerge(menu, item) {
    MenuHelpers.unmerge(menu, item)
  }
  
  sendToBrowserProcess(template, keystrokesByCommand) {
    ipcRenderer.send( 'update-application-menu', template, keystrokesByCommand)
  }
  
  // Get an {Array} of {String} classes for the given element.
  classesForElement(element) {
    const classList = (element) ? element.classList : null
    if (classList)
      return Array.prototype.slice.apply(classList)
    else
      return []
  }
  
  sortPackagesMenu() {
    const packagesMenu = _.find(this.template, ({label}) => {return MenuHelpers.normalizeLabel(label) == 'Packages'})
    if (!packagesMenu || !packagesMenu.submenu) return
  
    packagesMenu.submenu.sort( (item1, item2) => {
      if (item1.label && item2.label)
        MenuHelpers.normalizeLabel(item1.label).localeCompare(MenuHelpers.normalizeLabel(item2.label))
      else
        return 0
    });
    this.update()
  }
}
