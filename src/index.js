import { createElement } from './framework.js'
import { App } from './App.js'

function render(component, container) {
  const app = createElement(component)
  container.appendChild(app)
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app')
  if (!root) {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
  }
  render(App, root)
})
