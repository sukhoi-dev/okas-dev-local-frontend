import styles from './StatsCard.module.css';

export default function StatsCard({ label, value, delta, icon, color = 'blue' }) {
  const isPositive = delta > 0;
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>{value}</div>
      {delta !== undefined && (
        <div className={`${styles.delta} ${isPositive ? styles.up : styles.down}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(delta)}% vs last month
        </div>
      )}
    </div>
  );
}
