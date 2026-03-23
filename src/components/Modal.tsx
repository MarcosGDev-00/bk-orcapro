import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div 
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} 
        onClick={onClose} 
      />
      <div 
        className="glass animate-fade-in" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: 600, 
          borderRadius: '28px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          flexDirection: 'column', 
          maxHeight: '90vh',
          overflow: 'hidden',
          border: '1px solid var(--surface-border)'
        }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{title}</h2>
          <button 
            onClick={onClose} 
            className="glow-hover"
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 8, 
              borderRadius: '12px',
              color: 'var(--t2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '32px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
