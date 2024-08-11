import { createElement, Fragment } from './framework'

function Header({ name }) {
  return <h1>Hello, {name}!</h1>
}

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}

export function App() {
  return (
    <div>
      <>
        <p>a</p>
        <p>b</p>
        <div>c</div>
      </>
      <Header name="World" />
      <Button onClick={() => alert('Button clicked!')}>Click Me</Button>
    </div>
  )
}

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
