({Emitter, CompositeDisposable} = require('event-kit'))

class StylesElement extends HTMLElement {
  constructor() {
    this.subscriptions = null
    this.context = null
  }

  onDidAddStyleElement(callback)    {this.emitter.on('did-add-style-element', callback)}
  onDidRemoveStyleElement(callback) {this.emitter.on('did-remove-style-element', callback)}
  onDidUpdateStyleElement(callback) {this.emitter.on('did-update-style-element', callback)}
  
  createdCallback() {
    this.subscriptions = new CompositeDisposable
    this.emitter = new Emitter
    this.styleElementClonesByOriginalElement = new WeakMap
  }
  
  attachedCallback() {
    this.context = this.getAttribute('context')
  }
  
  detachedCallback() {
    this.subscriptions.dispose()
    this.subscriptions = new CompositeDisposable
  }
  
  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName == 'context')
      this.contextChanged()
  }
  
  initialize(styleManager) {
    this.styleManager = styleManager
    if (!this.styleManager)
      throw new Error("Must pass a styleManager parameter when initializing a StylesElement")
  
    this.subscriptions.add(this.styleManager.observeStyleElements(this.styleElementAdded.bind(this)))
    this.subscriptions.add(this.styleManager.onDidRemoveStyleElement(this.styleElementRemoved.bind(this)))
    this.subscriptions.add(this.styleManager.onDidUpdateStyleElement(this.styleElementUpdated.bind(this)))
  }
  
  contextChanged() {
    if (!this.subscriptions) return
  
    for (var child of Array.prototype.slice.call(this.children))
      this.styleElementRemoved(child)
  
    this.context = this.getAttribute('context')
  
    for (styleElement of this.styleManager.getStyleElements())
      this.styleElementAdded(styleElement)
    return
  }
  
  styleElementAdded(styleElement) {
    if (!this.styleElementMatchesContext(styleElement)) return
  
    styleElementClone = styleElement.cloneNode(true)
    styleElementClone.sourcePath = styleElement.sourcePath
    styleElementClone.context = styleElement.context
    styleElementClone.priority = styleElement.priority
    this.styleElementClonesByOriginalElement.set(styleElement, styleElementClone)
  
    priority = styleElement.priority
    if (priority)
      for (child of this.children)
        if (child.priority > priority) {
          insertBefore = child
          break
        }
  
    this.insertBefore(styleElementClone, insertBefore)
    this.emitter.emit('did-add-style-element', styleElementClone)
  }
  
  styleElementRemoved(styleElement) {
    if (!this.styleElementMatchesContext(styleElement)) return
  
    styleElementClone = this.styleElementClonesByOriginalElement.get(styleElement) || styleElement
    styleElementClone.remove()
    this.emitter.emit('did-remove-style-element', styleElementClone)
  }
  
  styleElementUpdated(styleElement) {
    if (!this.styleElementMatchesContext(styleElement)) return
  
    styleElementClone = this.styleElementClonesByOriginalElement.get(styleElement)
    styleElementClone.textContent = styleElement.textContent
    this.emitter.emit('did-update-style-element', styleElementClone)
  }
  
  styleElementMatchesContext(styleElement) {
    return this.context && (styleElement.context == this.context)
  }
}

module.exports = StylesElement = document.registerElement('atom-styles', {prototype: StylesElement.prototype})
