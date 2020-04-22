class PaneResizeHandleElement extends HTMLElement {
  createdCallback() {
    this.resizePane = this.resizePane.bind(this)
    this.resizeStopped = this.resizeStopped.bind(this)
    this.subscribeToDOMEvents()
  }

  subscribeToDOMEvents() {
    this.addEventListener('dblclick', this.resizeToFitContent.bind(this))
    this.addEventListener('mousedown', this.resizeStarted.bind(this))
  }

  attachedCallback() {
    // For some reason Chromium 58 is firing the attached callback after the
    // element has been detached, so we ignore the callback when a parent element
    // can't be found.
    if (this.parentElement) {
      this.isHorizontal = this.parentElement.classList.contains("horizontal")
      this.classList.add((this.isHorizontal) ? 'horizontal' : 'vertical')
    }
  }

  detachedCallback() {
    this.resizeStopped()
  }

  resizeToFitContent() {
    // clear flex-grow css style of both pane
    if (this.previousSibling) this.previousSibling.model.setFlexScale(1)
    if (this.nextSibling)     this.nextSibling.model.setFlexScale(1)
  }

  resizeStarted(e) {
    e.stopPropagation()
    document.addEventListener('mousemove', this.resizePane)
    document.addEventListener('mouseup', this.resizeStopped)
  }

  resizeStopped() {
    document.removeEventListener('mousemove', this.resizePane)
    document.removeEventListener('mouseup', this.resizeStopped)
  }

  calcRatio(ratio1, ratio2, total) {
    const allRatio = ratio1 + ratio2
    return [total * ratio1 / allRatio, total * ratio2 / allRatio]
  }

  setFlexGrow(prevSize, nextSize) {
    this.prevModel = this.previousSibling.model
    this.nextModel = this.nextSibling.model
    const totalScale = this.prevModel.getFlexScale() + this.nextModel.getFlexScale()
    const flexGrows = this.calcRatio(prevSize, nextSize, totalScale)
    this.prevModel.setFlexScale(flexGrows[0])
    this.nextModel.setFlexScale(flexGrows[1])
  }

  fixInRange(val, minValue, maxValue) {
    return Math.min(Math.max(val, minValue), maxValue)
  }

  resizePane({clientX, clientY, which}) {
    if ((which != 1) || !this.previousSibling || !this.nextSibling)
        return this.resizeStopped()

    if (this.isHorizontal) {
      totalWidth = this.previousSibling.clientWidth + this.nextSibling.clientWidth
      //get the left and right width after move the resize view
      leftWidth = clientX - this.previousSibling.getBoundingClientRect().left
      leftWidth = this.fixInRange(leftWidth, 0, totalWidth)
      rightWidth = totalWidth - leftWidth
      // set the flex grow by the ratio of left width and right width
      // to change pane width
      this.setFlexGrow(leftWidth, rightWidth)
    } else {
      totalHeight = this.previousSibling.clientHeight + this.nextSibling.clientHeight
      topHeight = clientY - this.previousSibling.getBoundingClientRect().top
      topHeight = this.fixInRange(topHeight, 0, totalHeight)
      bottomHeight = totalHeight - topHeight
      this.setFlexGrow(topHeight, bottomHeight)
    }
  }
}

module.exports = PaneResizeHandleElement =
document.registerElement('atom-pane-resize-handle', {prototype: PaneResizeHandleElement.prototype})
