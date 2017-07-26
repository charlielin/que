import { watch } from 'que/watcher'
import { valueFor, setValueFor, express } from 'que/helpers'

export const compile = (selector, viewModel) => {
  const compiler = new Compiler(viewModel)
  const element = document.querySelector(selector)
  if (element) {
    const fragment = document.createDocumentFragment()
    while (element.firstChild) {
      fragment.appendChild(element.firstChild)
    }
    compiler.compile(fragment)
    element.appendChild(fragment)
  }
}

class Compiler {
  constructor (viewModel) {
    this.viewModel = viewModel
  }

  compile (element) {
    switch (element.nodeType) {
      case 1:
        this.compileNode(element)
        break
      case 3:
        this.compileTemplate(element)
        break
      default:
    }
    if (element.childNodes) {
      element.childNodes.forEach((childNode) => {
        this.compile(childNode)
      })
    }
  }

  compileTemplate (element) {
    const reg = /(\{{2}[\w\d]+\}{2})/g
    const rawText = element.textContent
    const variables = element.textContent.match(reg)
    if (variables) {
      element.textContent = express(rawText, variables)
      variables.forEach((variable) => {
        const keypath = variable.slice(2, variable.length - 2)
        watch(this.viewModel, keypath, (value, oldValue) => {
          element.textContent = express(rawText, variables)
        })
      })
    }
  }

  compileNode (node) {
    const isDirective = (attribute) => {
      return attribute.indexOf('q-') === 0
    }
    const isEvent = (attribute) => {
      return attribute.indexOf('q:') === 0
    }
    for (const attribute of node.attributes) {
      const attributeName = attribute.name
      if (isDirective(attributeName)) {
        const directive = attributeName.split('-')[1]
        if (directive === 'model') {
          const keypath = attribute.value
          let value = valueFor(this.viewModel, keypath)
          node.value = value === 'undefined' ? '' : value
          watch(this.viewModel, keypath, (value, oldValue) => {
            if (value !== node.value) {
              node.value = value
            }
          })
          node.addEventListener('input', (e) => {
            const newValue = e.target.value
            if (value === newValue) {
              return
            }
            value = newValue
            setValueFor(this.viewModel, keypath, newValue)
          })
        }
        console.log(directive)
        if (directive === 'for') {
          const [elementName, arrayName] = attribute.value.split(' of ')
          const array = valueFor(this.viewModel, arrayName)
          console.log(node)
          console.log(node.childNodes)
          // for (const element of array) {
          //   setValueFor(this.viewModel, elementName, element)
          // }
        }
        if (directive === 'class') {
          const keypath = attribute.value
          const value = valueFor(this.viewModel, keypath)
          const classes = node.className.split(' ')
          classes.push(value)
          node.className = classes.join(' ')
          watch(this.viewModel, keypath, (value, oldValue) => {
            const classes = node.className.split(' ')
            const oldIndex = classes.indexOf(oldValue)
            if (oldIndex >= 0) {
              classes[oldIndex] = value
            } else {
              classes.push(value)
            }
            node.className = classes.join(' ')
          })
        }
        node.removeAttribute(attributeName)
      }
      if (isEvent(attributeName)) {
        const event = attributeName.split(':')[1]
        const handler = this.viewModel.options.reducers[attribute.value]
        node.addEventListener(event, handler.bind(this.viewModel), false)
        node.removeAttribute(attributeName)
      }
    }
  }
}
