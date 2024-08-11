import { Button } from '@/Button'
import { Button2 } from '@/Button2'

function Header({ name }) {
  return <h1>Hello, {name}!</h1>
}

export function App() {
  return (
    <div>
      <Header name="World" />
      <Button onClick={() => alert('Button clicked!')}>Click Me</Button>
      <Button2 class="clickBtn">Click!</Button2>
    </div>
  )
}
