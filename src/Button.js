import '@/button.scss'

export function Button({ onClick, children }) {
  return (
    <button
      class="clickBtn"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
