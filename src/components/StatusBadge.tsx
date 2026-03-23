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
      display: 'inline-block',
      padding: '4px 10px', 
      borderRadius: 9999, 
      fontSize: 12, 
      fontWeight: 500,
      background: current.bg,
      color: current.color,
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  );
}
