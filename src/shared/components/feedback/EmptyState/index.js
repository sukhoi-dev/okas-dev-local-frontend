export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      {icon && <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>}
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>
      {description && (
        <p style={{ margin: '0 0 1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
