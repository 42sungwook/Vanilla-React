import { useState } from '@/framework'
import { Button } from '@/Button'
import { Component } from '@/Component'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>{'Increment'}</Button>
      <Component />
    </div>
  )
}
