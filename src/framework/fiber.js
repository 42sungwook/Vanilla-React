import globalVar from '@/framework/globalVariable'

const Fragment = ({ children }) => children

const createTextElement = (text) => ({
  type: 'TEXT_ELEMENT',
  props: {
    nodeValue: text,
    children: []
  }
})

function createElement(type, props = {}, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      )
    }
  }
}

const createDOM = (fiber) => {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)

  updateDOM(dom, {}, fiber.props)

  return dom
}

const updateDOM = (dom, prevProps = {}, nextProps = {}) => {
  // Remove event listeners
  Object.keys(prevProps)
    .filter((key) => key.startsWith('on'))
    .filter((key) => !(key in nextProps) || prevProps[key] !== nextProps[key])
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter((key) => key.startsWith('on'))
    .filter((key) => prevProps[key] !== nextProps[key])
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })

  // Remove properties
  Object.keys(prevProps)
    .filter((key) => key !== 'children')
    .filter((key) => !(key in nextProps))
    .forEach((name) => {
      dom[name] = ''
    })

  // Add properties
  Object.keys(nextProps)
    .filter((key) => key !== 'children')
    .filter((key) => prevProps[key] !== nextProps[key])
    .forEach((name) => {
      if (name === 'nodeValue' && dom.nodeValue !== undefined) {
        dom.nodeValue = nextProps[name]
      } else {
        dom[name] = nextProps[name]
      }
    })
}

const reconcileChildren = (wipFiber, elements) => {
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  const newElements = elements.flat()

  while (index < newElements.length || oldFiber != null) {
    const element = newElements[index]
    let newFiber = null

    const sameType = oldFiber && element && element.type === oldFiber.type

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      }
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION'
      globalVar.deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

const commitRoot = () => {
  globalVar.deletions.forEach(commitWork)
  commitWork(globalVar.wipRoot.child)
  globalVar.currentRoot = globalVar.wipRoot
  globalVar.wipRoot = null
}

const commitWork = (fiber) => {
  if (!fiber) {
    return
  }

  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDOM(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

const commitDeletion = (fiber, domParent) => {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

const updateFunctionComponent = (fiber) => {
  globalVar.setWipFiber(fiber)
  fiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

const updateHostComponent = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber)
  }
  reconcileChildren(fiber, fiber.props.children || [])
}

const performUnitOfWork = (fiber) => {
  const isFunctionComponent = typeof fiber.type === 'function'

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

const workLoop = (deadline) => {
  let shouldYield = false
  while (globalVar.nextUnitOfWork && !shouldYield) {
    globalVar.nextUnitOfWork = performUnitOfWork(globalVar.nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!globalVar.nextUnitOfWork && globalVar.wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function render(element, container) {
  globalVar.wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: globalVar.currentRoot
  }
  globalVar.resetDeletions()
  globalVar.nextUnitOfWork = globalVar.wipRoot
}

requestIdleCallback(workLoop)

export { createElement, render, Fragment }
