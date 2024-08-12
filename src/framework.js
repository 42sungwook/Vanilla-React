let currentComponent = null
let currentHook = 0
const components = new Map()

function useState(initial) {
  const component = currentComponent
  const hookId = currentHook++

  if (!components.has(component)) {
    components.set(component, [])
  }

  const componentHooks = components.get(component)

  if (hookId >= componentHooks.length) {
    componentHooks.push({
      value: typeof initial === 'function' ? initial() : initial
    })
  }

  const hook = componentHooks[hookId]

  const setState = (newValue) => {
    const value =
      typeof newValue === 'function' ? newValue(hook.value) : newValue
    if (value !== hook.value) {
      hook.value = value
      scheduleUpdate(component)
    }
  }

  return [hook.value, setState]
}

function createElement(tag, props, ...children) {
  if (typeof tag === 'function') {
    return tag({ ...props, children })
  }

  const element = document.createElement(tag)

  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith('on') && name.toLowerCase() in window)
      element.addEventListener(name.toLowerCase().substr(2), value)
    else element.setAttribute(name, value.toString())
  })

  children.forEach((child) => {
    appendChild(element, child)
  })

  return element
}

function appendChild(parent, child) {
  if (child === null || child === undefined) {
    return
  }
  if (Array.isArray(child)) {
    child.forEach((nestedChild) => appendChild(parent, nestedChild))
  } else {
    parent.appendChild(
      child.nodeType ? child : document.createTextNode(child.toString())
    )
  }
}

function Fragment(props) {
  return props.children
}

function scheduleUpdate(component) {
  queueMicrotask(() => {
    const root = document.getElementById('app')
    root.innerHTML = ''
    currentComponent = component
    currentHook = 0
    const newElement = component()
    root.appendChild(newElement)
  })
}

function render(component, container) {
  currentComponent = component
  currentHook = 0
  const app = createElement(component)
  container.appendChild(app)
}

export { createElement, Fragment, useState, render }
