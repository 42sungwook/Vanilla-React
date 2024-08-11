import { Button } from '@/Button'

function Header({ name }) {
  return <h1>Hello, {name}!</h1>
}

export function App() {
  return (
    <div>
      <Header name="World" />
      <Button onClick={() => alert('Button clicked!')}>Click Me</Button>
    </div>
  )
}
