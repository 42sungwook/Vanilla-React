import { createElement, render } from '@/framework.js'
import { App } from '@/App.js'
import '@/main.scss'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app')
  if (!root) {
    const root = document.createElement('div')
    root.id = 'app'
    document.body.appendChild(root)
  }
  render(App, root)
})
