import React from 'react';

interface StatusBadgeProps {
  status: 'rascunho' | 'enviado' | 'aprovado' | 'recusado';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    rascunho: { bg: 'var(--s3)', color: 'var(--t2)' },
    enviado: { bg: 'var(--bbg)', color: 'var(--blue)' },
    aprovado: { bg: 'var(--gbg)', color: 'var(--green)' },
    recusado: { bg: 'var(--rbg)', color: 'var(--red)' },
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
