import React from 'react';

interface StatusBadgeProps {
  status: 'rascunho' | 'enviado' | 'aprovado' | 'recusado';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    rascunho: { bg: 'rgba(148, 163, 184, 0.1)', color: 'var(--t2)' },
    enviado: { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--blue)' },
    aprovado: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--green)' },
    recusado: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--red)' },
  };
  const current = styles[status] || styles.rascunho;

  return (
    <span style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px', 
      borderRadius: '8px', 
      fontSize: 11, 
      fontWeight: 800,
      background: current.bg,
      color: current.color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      border: `1px solid ${current.color}15`
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: current.color, boxShadow: `0 0 8px ${current.color}` }} />
      {status}
    </span>
  );
}
