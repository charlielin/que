import { observe } from 'que/observer'
import { compile } from 'que/compiler'

class Que {
  constructor (options) {
    this.options = options
    this._props = options.props
    Object.keys(this._props).forEach((key) => {
      this.proxy(key)
    })
    observe(this._props, this)
  }

  render (selector) {
    compile(selector, this)
  }

  proxy (key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: false,
      get: function proxyGetter () {
        return this._props[key]
      },
      set: function proxySetter (newVal) {
        this._props[key] = newVal
      }
    })
  }
}

export default Que
