const {CompositeDisposable} = require('event-kit')
const PaneResizeHandleElement = require('./pane-resize-handle-element')

class PaneAxisElement extends HTMLElement {
  attachedCallback() {
    if (!this.subscriptions) this.subscriptions = this.subscribeToModel()
    for (const index in this.model.getChildren()) {
      const child = this.model.getChildren()[index]
      this.childAdded({child, index})
    }
  }

  detachedCallback() {
    this.subscriptions.dispose()
    this.subscriptions = null
    for (child of this.model.getChildren())
      this.childRemoved({child}) 
  }
  
  initialize(model, viewRegistry) {
    this.model = model;
    this.viewRegistry = viewRegistry;
    if (!this.subscriptions) this.subscriptions = this.subscribeToModel()
    for (const index in this.model.getChildren()) {
      const child = this.model.getChildren()[index]
      this.childAdded({child, index})
    }
  
    switch (this.model.getOrientation()) {
      case 'horizontal': this.classList.add('horizontal', 'pane-row')  ; break;
      case 'vertical':   this.classList.add('vertical', 'pane-column') ; break;
    }
    return this
  }

  subscribeToModel() {
    subscriptions = new CompositeDisposable()
    subscriptions.add(this.model.onDidAddChild(this.childAdded.bind(this)))
    subscriptions.add(this.model.onDidRemoveChild(this.childRemoved.bind(this)))
    subscriptions.add(this.model.onDidReplaceChild(this.childReplaced.bind(this)))
    subscriptions.add(this.model.observeFlexScale(this.flexScaleChanged.bind(this)))
    return subscriptions
  }
  
  isPaneResizeHandleElement(element) {
    return element && (element.nodeName.toLowerCase() == 'atom-pane-resize-handle')
  }
  
  childAdded({child, index}) {
    view = this.viewRegistry.getView(child)
    this.insertBefore(view, this.children[index * 2])
  
    prevElement = view.previousSibling
    // if previous element is not pane resize element, then insert new resize element
    if (prevElement && ! this.isPaneResizeHandleElement(prevElement))
      resizeHandle = document.createElement('atom-pane-resize-handle')
      this.insertBefore(resizeHandle, view)
  
    nextElement = view.nextSibling
    // if next element isnot resize element, then insert new resize element
    if (nextElement && ! this.isPaneResizeHandleElement(nextElement))
      resizeHandle = document.createElement('atom-pane-resize-handle')
      this.insertBefore(resizeHandle, nextElement)
  }
  
  childRemoved({child}) {
    view = this.viewRegistry.getView(child)
    siblingView = view.previousSibling
    // make sure next sibling view is pane resize view
    if (siblingView && this.isPaneResizeHandleElement(siblingView))
      siblingView.remove()
    view.remove()
  }
  
  childReplaced({index, oldChild, newChild}) {
    const focusedElement = (this.hasFocus()) ? document.activeElement : null
    this.childRemoved({child: oldChild, index})
    this.childAdded({child: newChild, index})
    if (document.activeElement == document.body && focusedElement)
      focusedElement.focus()
  }
  
  flexScaleChanged(flexScale) {this.style.flexGrow = flexScale}
  
  hasFocus() {
    return this === document.activeElement || this.contains(document.activeElement)
  }
}

module.exports = PaneAxisElement = document.registerElement('atom-pane-axis', {prototype: PaneAxisElement.prototype})
