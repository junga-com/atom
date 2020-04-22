nextInstanceId = 1

module.exports = class Model {
  static resetNextInstanceId() {nextInstanceId = 1}

  constructor(params) {
    this.alive = true
    this.assignId(params && params.id)
  }

  assignId(id) {
    this.id = id || nextInstanceId++
    if (id >= nextInstanceId)
      nextInstanceId = id + 1 
  }

  destroy() {
    if (!this.isAlive()) return
    this.alive = false;
    this.destroyed()
  }

  destroyed() {}

  isAlive() {return this.alive}

  isDestroyed() {return !this.alive}
}
