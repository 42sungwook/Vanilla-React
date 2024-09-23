class GlobalVariable {
  constructor() {
    if (GlobalVariable.instance) {
      return GlobalVariable.instance
    }

    this.wipRoot = null
    this.nextUnitOfWork = null
    this.currentRoot = null
    this.deletions = []
    this.wipFiber = null
    this.hookIndex = 0

    GlobalVariable.instance = this
  }

  setWipFiber(fiber) {
    this.wipFiber = fiber
    this.hookIndex = 0
  }

  resetDeletions() {
    this.deletions = []
  }

  setState(action) {
    this.wipRoot = {
      dom: this.currentRoot.dom,
      props: this.currentRoot.props,
      alternate: this.currentRoot
    }
    this.nextUnitOfWork = this.wipRoot
    this.resetDeletions()
  }
}

const globalVar = new GlobalVariable()

export default globalVar
