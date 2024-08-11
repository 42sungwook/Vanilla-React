import styles from '@/button.module.scss'

export function Button({ onClick, children }) {
  return (
    <button
      class={styles.clickBtn}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
