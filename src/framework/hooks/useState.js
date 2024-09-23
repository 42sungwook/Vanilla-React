import globalVar from '@/framework/globalVariable'

function useState(initial) {
  const oldHook =
    globalVar.wipFiber.alternate &&
    globalVar.wipFiber.alternate.hooks &&
    globalVar.wipFiber.alternate.hooks[globalVar.hookIndex]

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach((action) => {
    hook.state = action(hook.state)
  })

  const setState = (action) => {
    hook.queue.push(typeof action === 'function' ? action : () => action)
    globalVar.setState()
  }

  globalVar.wipFiber.hooks.push(hook)
  globalVar.hookIndex++
  return [hook.state, setState]
}

export { useState }
