export const valueFor = (data, keypath) => {
  let value = data
  const keys = keypath.split('.')
  keys.forEach((key) => {
    value = value[key]
  })
  return value
}

export const setValueFor = (data, keypath, newValue) => {
  let value = data
  const keys = keypath.split('.')
  const length = keys.length
  keys.forEach((key, index) => {
    if (index !== length - 1) {
      value = value[key]
    } else {
      value[key] = newValue
    }
  })
}

export const express = (text, variables) => {
  variables.forEach((variable) => {
    const keypath = variable.slice(2, variable.length - 2)
    const value = valueFor(this.viewModel, keypath)
    text = text.replace(variable, value)
  })
  return text
}
