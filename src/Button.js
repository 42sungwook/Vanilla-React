import styles from '@/button.module.scss'

export function Button({ onClick, children }) {
  return (
    <button
      className={styles.clickBtn}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
