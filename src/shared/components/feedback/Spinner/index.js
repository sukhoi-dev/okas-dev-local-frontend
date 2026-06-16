import styles from './Spinner.module.css';

export default function Spinner({ fullScreen = false, size = 'md', label = 'Loading...' }) {
  const spinner = (
    <div className={`${styles.wrapper} ${styles[size]}`} role="status" aria-label={label}>
      <div className={styles.ring} />
    </div>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{spinner}</div>;
  }

  return spinner;
}
