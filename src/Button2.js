import styles from '@/another.module.scss'

export function Button2({ children }) {
  return <button class={styles.clickBtn}>{children}</button>
}
