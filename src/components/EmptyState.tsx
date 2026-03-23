import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'var(--s1)', borderRadius: 10, border: '1px solid var(--ln)', textAlign: 'center' }}>
      <div style={{ color: 'var(--t3)', marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--t2)', marginBottom: action ? 24 : 0, maxWidth: 300 }}>{description}</p>
      {action}
    </div>
  );
}
