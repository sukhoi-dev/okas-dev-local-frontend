import styles from './Button.module.css';

const VARIANTS = { primary: 'primary', secondary: 'secondary', danger: 'danger', ghost: 'ghost' };
const SIZES    = { sm: 'sm', md: 'md', lg: 'lg' };

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  const cls = [
    styles.btn,
    styles[VARIANTS[variant] || 'primary'],
    styles[SIZES[size] || 'md'],
    fullWidth ? styles.full : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  );
}
