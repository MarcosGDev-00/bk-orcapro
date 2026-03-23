import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', borderRadius: '28px', border: '1px solid var(--surface-border)', textAlign: 'center', boxShadow: 'var(--card-shadow)' }}>
      <div style={{ color: 'var(--accent)', marginBottom: 24, opacity: 0.6 }}>{icon}</div>
      <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--t2)', marginBottom: action ? 32 : 0, maxWidth: 400, lineHeight: 1.6 }}>{description}</p>
      {action}
    </div>
  );
}
