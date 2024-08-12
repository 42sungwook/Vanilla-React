import { useState } from '@/framework'
import { Button } from '@/Button'

export const Component = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count2: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  )
}
