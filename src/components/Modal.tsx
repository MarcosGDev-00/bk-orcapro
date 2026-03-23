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
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 1000, 
      display: 'flex', 
      flexDirection: 'column',
      padding: window.innerWidth <= 768 ? '0' : '40px 16px',
      overflowY: 'auto',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      alignItems: 'center'
    }}>
      <div 
        style={{ position: 'fixed', inset: 0, zIndex: -1 }} 
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
          margin: window.innerWidth <= 768 ? 'auto 0 0 0' : 'auto',
          border: '1px solid var(--surface-border)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          flexShrink: 0,
          maxHeight: window.innerWidth <= 768 ? '92vh' : 'none'
        }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
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
        <div style={{ padding: window.innerWidth <= 768 ? '24px' : '40px', overflowY: 'visible' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
