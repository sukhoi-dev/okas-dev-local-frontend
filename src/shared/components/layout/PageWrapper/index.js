import styles from './PageWrapper.module.css';

export default function PageWrapper({ title, subtitle, action, children }) {
  return (
    <div className={styles.page}>
      {(title || action) && (
        <div className={styles.header}>
          <div>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
