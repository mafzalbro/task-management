import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Rocket, Globe, Cloud, BarChart3, X } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    { icon: Zap, title: 'Infinite Workflows', desc: 'Unlimited tasks and projects' },
    { icon: Shield, title: 'Advanced Security', desc: 'SSO and Audit Logging' },
    { icon: BarChart3, title: 'Custom Analytics', desc: 'Visualize your velocity' },
    { icon: Rocket, title: 'Priority Support', desc: '24/7 dedicated assistance' },
    { icon: Globe, title: 'Team Collaboration', desc: 'Unlimited workspace members' },
    { icon: Cloud, title: 'Smart Sync', desc: 'Real-time multi-device sync' },
  ];

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff',
            width: '800px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            overflow: 'hidden',
            maxHeight: '90vh',
          }}
        >
          {/* Left Panel */}
          <div style={{ background: 'var(--primary)', padding: '48px', color: '#fff', position: 'relative' }}>
             <div style={{ marginBottom: '32px' }}>
                <Zap size={48} style={{ marginBottom: '24px', color: '#fff' }} />
                <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>Zenith Pro</h2>
                <p style={{ opacity: 0.8, fontSize: '15px', lineHeight: 1.6 }}>Take your productivity to the next level with our most powerful features.</p>
             </div>

             <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '48px', fontWeight: 800 }}>$12<span style={{ fontSize: '16px', opacity: 0.6 }}>/mo</span></div>
                <p style={{ fontSize: '13px', opacity: 0.6 }}>Billed annually</p>
             </div>
          </div>

          {/* Right Panel */}
          <div style={{ padding: '48px', position: 'relative' }}>
            <button
                onClick={onClose}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
                <X size={24} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '32px' }}>Enterprise Features</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
                {features.map((f, i) => (
                    <div key={i}>
                        <div style={{ color: 'var(--primary)', marginBottom: '8px' }}>
                            <f.icon size={20} />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{f.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{f.desc}</div>
                    </div>
                ))}
            </div>

            <button
                className="btn-primary"
                style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', justifyContent: 'center' }}
                onClick={() => { alert('In a real app, this would open Stripe!'); onClose(); }}
            >
                Start Free Trial
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>No credit card required</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpgradeModal;
