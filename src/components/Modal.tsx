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
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: window.innerWidth <= 768 ? 'flex-end' : 'center', justifyContent: 'center', padding: window.innerWidth <= 768 ? '0' : '16px' }}>
      <div 
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} 
        onClick={onClose} 
      />
      <div 
        className="animate-fade-in shadow-2xl" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: 640, 
          borderRadius: window.innerWidth <= 768 ? '32px 32px 0 0' : '28px', 
          background: 'var(--modal-bg)',
          display: 'flex', 
          flexDirection: 'column', 
          maxHeight: window.innerWidth <= 768 ? '92vh' : '90vh',
          overflow: 'hidden',
          border: '1px solid var(--surface-border)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ padding: window.innerWidth <= 768 ? '24px' : '24px 40px', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
          <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.5px' }}>{title}</h2>
          <button 
            onClick={onClose} 
            className="glow-hover"
            style={{ 
              background: 'var(--t4)', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 10, 
              borderRadius: '14px',
              color: 'var(--t2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div style={{ padding: window.innerWidth <= 768 ? '24px' : '40px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
