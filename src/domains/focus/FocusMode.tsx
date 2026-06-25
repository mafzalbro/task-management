import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, CheckCircle2, Coffee, Zap, MessageSquare } from 'lucide-react';
import type { Post } from '../../shared/types';
import confetti from 'canvas-confetti';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  task: Post | null;
  onComplete: (id: string, status: Post["status"]) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose, task, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      handleSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionEnd = () => {
    setIsActive(false);
    if (mode === 'work') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setSessionCount(prev => prev + 1);
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0F172A',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
        }}
      >
        {/* Top Header */}
        <div style={{ padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex items-center gap-4">
            <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px', fontWeight: 800, color: 'var(--primary-light)', border: '1px solid rgba(255,255,255,0.1)' }}>
               ZENITH FOCUS
            </div>
            {task && (
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                    Working on: <span style={{ color: 'white' }}>{task.title}</span>
                </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="icon-btn-ghost"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Focus Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 48px' }}>

          <motion.div
            key={mode}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '48px' }}
          >
             {mode === 'work' ? (
                 <div className="flex items-center gap-2" style={{ color: '#F87171', fontSize: '18px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    <Zap size={20} fill="#F87171" /> Deep Work Session
                 </div>
             ) : (
                 <div className="flex items-center gap-2" style={{ color: '#60A5FA', fontSize: '18px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    <Coffee size={20} fill="#60A5FA" /> Break Time
                 </div>
             )}
             <div style={{ fontSize: '180px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '-0.05em', lineHeight: 1 }}>
                {formatTime(timeLeft)}
             </div>
          </motion.div>

          <div className="flex gap-6">
             <button
                onClick={toggleTimer}
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'white',
                    color: '#0F172A',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
             >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />}
             </button>
             <button
                onClick={resetTimer}
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
             >
                <RotateCcw size={28} />
             </button>
          </div>

          <div style={{ marginTop: '80px', maxWidth: '600px', width: '100%' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', opacity: 0.6 }}>
                 <div style={{ fontSize: '14px', fontWeight: 700 }}>SESSION INFO</div>
                 <div style={{ fontSize: '14px', fontWeight: 700 }}>{sessionCount} COMPLETED</div>
             </div>

             {task ? (
                 <div style={{ padding: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>{task.title}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.5 }}>
                                {task.description || "No description provided."}
                            </p>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ background: 'var(--success)', color: 'white', padding: '10px 20px' }}
                            onClick={() => {
                                onComplete(task.id, 'Completed');
                                onClose();
                            }}
                        >
                            <CheckCircle2 size={18} /> Complete
                        </button>
                    </div>
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '32px' }}>
                        <div className="flex items-center gap-2" style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                            <PieChart size={16} /> Effort: {task.estimate || 0} pts
                        </div>
                        <div className="flex items-center gap-2" style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                            <MessageSquare size={16} /> {task.subtasks?.length || 0} Subtasks
                        </div>
                    </div>
                 </div>
             ) : (
                 <div style={{ padding: '48px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', fontWeight: 500 }}>
                        No task selected for this focus session.
                    </p>
                 </div>
             )}
          </div>
        </div>

        {/* Footer Shortcuts */}
        <div style={{ padding: '32px 48px', display: 'flex', gap: '32px', justifyContent: 'center', opacity: 0.4 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ border: '1px solid white', padding: '2px 6px', borderRadius: '4px' }}>SPACE</span> PLAY/PAUSE
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ border: '1px solid white', padding: '2px 6px', borderRadius: '4px' }}>R</span> RESET
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ border: '1px solid white', padding: '2px 6px', borderRadius: '4px' }}>ESC</span> EXIT
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Internal PieChart icon replacement since it was not imported
const PieChart = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
);

export default FocusMode;
